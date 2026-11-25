-- Hub Zero schema v7: hub owners and the planner.
--
-- The planner (imransyednaqvi.com/planner) is the first signed-in page. Its
-- owner reads the hub's social posts and moves them through review: approve,
-- back to draft, cancel, retry a failed post, edit the caption or the time.
-- Everything else stays where it was: drafts are written with the secret key,
-- and the publish job (secret key) does the publishing.
--
-- hub_members says who runs a hub. It is a table of its own, not a column on
-- hubs, so the public can keep reading hubs without seeing account ids, and so
-- Stage 4 can add team members without another change to hubs.

create table public.hub_members (
  hub_id     uuid not null references public.hubs (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner')),
  created_at timestamptz not null default now(),
  primary key (hub_id, user_id)
);

comment on table public.hub_members is 'Who runs a hub. Only owners for now; Stage 4 adds editors.';

create index hub_members_user_idx on public.hub_members (user_id);

revoke all on table public.hub_members from anon, authenticated;
grant select on table public.hub_members to authenticated;
grant select, insert, update, delete on table public.hub_members to service_role;
alter table public.hub_members enable row level security;

create policy "Members see their own memberships"
  on public.hub_members for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- social_posts: the owner reads them and changes three things
-- ---------------------------------------------------------------------------

grant select on table public.social_posts to authenticated;
grant update (caption, scheduled_at, status) on table public.social_posts to authenticated;

create policy "Hub owners read their posts"
  on public.social_posts for select to authenticated
  using (exists (
    select 1 from public.hub_members m
    where m.hub_id = social_posts.hub_id
      and m.user_id = (select auth.uid())
      and m.role = 'owner'
  ));

create policy "Hub owners review their posts"
  on public.social_posts for update to authenticated
  using (exists (
    select 1 from public.hub_members m
    where m.hub_id = social_posts.hub_id
      and m.user_id = (select auth.uid())
      and m.role = 'owner'
  ))
  with check (exists (
    select 1 from public.hub_members m
    where m.hub_id = social_posts.hub_id
      and m.user_id = (select auth.uid())
      and m.role = 'owner'
  ));

-- Review moves a post one sensible step; the publish job does the rest. A
-- post Instagram already has (publishing, published) is no longer editable.
-- Retrying a failed post clears its error and attempt count so the publish
-- job starts it fresh. Only signed-in users are checked: the secret key
-- (Claude's drafts, the publish job) is not limited by this.
create function private.guard_post_review()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user <> 'authenticated' then
    return new;
  end if;

  if old.status in ('publishing', 'published') then
    raise exception 'This post is already with Instagram, so it can no longer be changed.'
      using errcode = 'P0001';
  end if;

  if new.status is distinct from old.status then
    if (old.status, new.status) not in (
      ('draft', 'approved'),
      ('approved', 'draft'),
      ('draft', 'cancelled'),
      ('approved', 'cancelled'),
      ('cancelled', 'draft'),
      ('failed', 'approved'),
      ('failed', 'cancelled')
    ) then
      raise exception 'A post cannot go from % to %.', old.status, new.status
        using errcode = 'P0001';
    end if;

    if old.status = 'failed' then
      new.attempts := 0;
      new.error := null;
      new.container_id := null;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.guard_post_review() from public;

create trigger social_posts_guard_review
  before update on public.social_posts
  for each row execute function private.guard_post_review();
