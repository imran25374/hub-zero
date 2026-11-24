-- Hub Zero schema v6: the social publishing queue.
--
-- social_posts is the plan for Instagram (and later other channels): what goes
-- out, when, with which media, and what happened. Claude drafts rows, Imran
-- approves them, a scheduled job on the site publishes whatever is approved
-- and due through Instagram's Content Publishing API and writes the result
-- back. integration_tokens holds the long-lived API token so the job can
-- refresh it before it expires (Instagram tokens last 60 days).
--
-- Neither table is public: no grants to anon or authenticated, row-level
-- security on with no policies, so only the secret key (service_role) reads
-- or writes them.

create table public.social_posts (
  id              uuid primary key default gen_random_uuid(),
  hub_id          uuid not null references public.hubs (id) on delete cascade,
  channel         text not null default 'instagram' check (channel in ('instagram')),
  kind            text not null check (kind in ('image', 'carousel', 'reel', 'story')),
  scheduled_at    timestamptz not null,
  caption         text not null check (char_length(caption) between 1 and 2200),
  media_urls      text[] not null check (
                    array_length(media_urls, 1) between 1 and 10
                    and array_to_string(media_urls, ' ') !~ '(^| )(?!https://)'
                  ),
  cover_url       text check (cover_url ~ '^https://'),
  share_to_feed   boolean not null default true,
  is_affiliate    boolean not null default false,
  is_ai_generated boolean not null default false,
  promotes        text check (char_length(promotes) <= 200),
  status          text not null default 'draft'
                    check (status in ('draft', 'approved', 'publishing', 'published', 'failed', 'cancelled')),
  container_id    text,
  external_id     text,
  permalink       text check (permalink ~ '^https://'),
  error           text,
  attempts        integer not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- A carousel is 2 to 10 items; everything else is one file.
  constraint social_posts_media_count check (
    (kind = 'carousel' and array_length(media_urls, 1) between 2 and 10)
    or (kind <> 'carousel' and array_length(media_urls, 1) = 1)
  ),
  -- Affiliate posts carry the disclosure in the caption (Associates and FTC rules).
  constraint social_posts_affiliate_disclosure check (
    not is_affiliate or caption ~* '(#ad\M|\(paid link\)|#commissionsearned)'
  ),
  -- Amazon links never go in a caption (Instagram does not link them anyway; the
  -- bio and the site carry them, with their disclosure).
  constraint social_posts_no_amazon check (
    caption !~* 'https?://([a-z0-9-]+\.)*(amazon\.[a-z.]+|amzn\.[a-z]+)'
  )
);

comment on table public.social_posts is 'Planned and published social posts: Claude drafts, Imran approves, the publish job posts and records the result.';
comment on column public.social_posts.kind is 'image (one JPEG), carousel (2–10 JPEGs or MP4s), reel (one MP4), story (one JPEG or MP4).';
comment on column public.social_posts.media_urls is 'Public https URLs of the media, in order: Supabase Storage for images, R2 for video.';
comment on column public.social_posts.cover_url is 'Cover frame for a reel (JPEG); optional.';
comment on column public.social_posts.promotes is 'What the post leads to: a book, a page, a pick. Free text for reporting.';
comment on column public.social_posts.status is 'draft → approved (by Imran) → publishing (container created, video processing) → published | failed. cancelled stops a draft or approved post.';
comment on column public.social_posts.container_id is 'Instagram media container id while publishing.';
comment on column public.social_posts.external_id is 'The published Instagram media id.';

create index social_posts_due_idx on public.social_posts (status, scheduled_at);

create trigger social_posts_set_updated_at
  before update on public.social_posts
  for each row execute function private.set_updated_at();

revoke all on table public.social_posts from anon, authenticated;
grant select, insert, update, delete on table public.social_posts to service_role;
alter table public.social_posts enable row level security;

-- ---------------------------------------------------------------------------
-- API tokens the publish job keeps fresh
-- ---------------------------------------------------------------------------

create table public.integration_tokens (
  provider    text primary key check (provider in ('instagram')),
  account_id  text not null,
  token       text not null,
  expires_at  timestamptz not null,
  updated_at  timestamptz not null default now()
);

comment on table public.integration_tokens is 'Long-lived API tokens, refreshed by the publish job before they expire. Seeded from the INSTAGRAM_ACCESS_TOKEN environment variable on the first run.';

create trigger integration_tokens_set_updated_at
  before update on public.integration_tokens
  for each row execute function private.set_updated_at();

revoke all on table public.integration_tokens from anon, authenticated;
grant select, insert, update, delete on table public.integration_tokens to service_role;
alter table public.integration_tokens enable row level security;
