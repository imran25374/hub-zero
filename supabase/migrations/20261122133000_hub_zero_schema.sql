-- Hub Zero schema: hubs, sections, links, analytics_events.
--
-- Access model
--   * Visitors (anon) and signed-in users (authenticated) can READ published
--     hubs, sections and links, and can INSERT click events. Nothing else.
--   * analytics_events cannot be read, changed or deleted through the public API.
--   * Content is written with the secret key (service_role), which bypasses RLS:
--     the Supabase dashboard now, the Hub Zero admin page in Stage 3.
--
-- Since 30 May 2026, new Supabase projects do not grant table access to the
-- API roles automatically, so every grant below is explicit.

-- ---------------------------------------------------------------------------
-- Helpers (kept out of the API-exposed public schema)
-- ---------------------------------------------------------------------------

create schema if not exists private;
revoke all on schema private from public;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- The five launch layout archetypes. Adding one is a deliberate migration
-- (principle 4: constrained slots).
create domain public.layout_archetype as text
  check (value in ('hero-split', 'magazine-grid', 'portfolio-mosaic', 'dashboard', 'classic-stack'));

-- ---------------------------------------------------------------------------
-- hubs: one row per identity (Hub Zero is username 'imran')
-- ---------------------------------------------------------------------------

create table public.hubs (
  id                 uuid primary key default gen_random_uuid(),
  username           text not null unique
                       constraint hubs_username_format
                       check (username ~ '^[a-z0-9](?:[a-z0-9_-]{0,28}[a-z0-9])?$'),
  display_name       text not null check (char_length(display_name) between 1 and 80),
  identity_statement text check (char_length(identity_statement) <= 160),
  profile_image_url  text check (profile_image_url ~ '^https://'),
  cover_image_url    text check (cover_image_url ~ '^https://'),
  theme_id           text,
  layout_id          public.layout_archetype,
  is_published       boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.hubs is 'One identity hub: hero card plus venture tiles.';
comment on column public.hubs.layout_id is 'Null = the standard hero card and tiles home.';

create trigger hubs_set_updated_at
  before update on public.hubs
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- sections: the venture tiles and their drill-down pages
-- ---------------------------------------------------------------------------

create table public.sections (
  id             uuid primary key default gen_random_uuid(),
  hub_id         uuid not null references public.hubs (id) on delete cascade,
  slug           text not null check (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$'),
  title          text not null check (char_length(title) between 1 and 80),
  description    text check (char_length(description) <= 500),
  icon_image_url text check (icon_image_url ~ '^https://'),
  order_index    integer not null default 0,
  layout_id      public.layout_archetype not null,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (hub_id, slug)
);

comment on table public.sections is 'A venture or category tile, routed at /<slug>.';

create index sections_hub_order_idx on public.sections (hub_id, order_index);

create trigger sections_set_updated_at
  before update on public.sections
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- links: everything a section shows
-- ---------------------------------------------------------------------------

create table public.links (
  id              uuid primary key default gen_random_uuid(),
  section_id      uuid not null references public.sections (id) on delete cascade,
  title           text not null check (char_length(title) between 1 and 120),
  url             text not null
                    check (url ~* '^(https?://|mailto:)' and char_length(url) <= 2048),
  image_url       text check (image_url ~ '^https://'),
  description     text check (char_length(description) <= 500),
  tags            text[] not null default '{}',
  is_affiliate    boolean not null default false,
  disclosure_line text,
  order_index     integer not null default 0,
  click_count     bigint not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- Compliance (project instructions section 6): every affiliate pick is marked.
  constraint links_affiliate_disclosure check (
    not is_affiliate
    or (disclosure_line is not null and disclosure_line in ('#ad', '(paid link)'))
  )
);

comment on table public.links is 'A link inside a section. Affiliate links must carry #ad or (paid link).';
comment on column public.links.click_count is 'Maintained by a trigger on analytics_events. Do not write directly.';

create index links_section_order_idx on public.links (section_id, order_index);

-- Click-count bumps must not look like content edits.
create trigger links_set_updated_at
  before update on public.links
  for each row
  when (old.click_count is not distinct from new.click_count)
  execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- analytics_events: one row per outbound link click
-- ---------------------------------------------------------------------------

create table public.analytics_events (
  id           bigint generated always as identity primary key,
  link_id      uuid references public.links (id) on delete set null,
  occurred_at  timestamptz not null default now(),
  referrer     text check (char_length(referrer) <= 2048),
  country      text check (country ~ '^[A-Z]{2}$'),
  device       text check (device in ('mobile', 'tablet', 'desktop', 'other')),
  utm_source   text check (char_length(utm_source) <= 200),
  utm_medium   text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  utm_term     text check (char_length(utm_term) <= 200),
  utm_content  text check (char_length(utm_content) <= 200)
);

comment on table public.analytics_events is 'Link clicks. Insert-only for the public API; read with the secret key.';
comment on column public.analytics_events.link_id is 'Set to null if the link is later deleted, so history is kept.';

create index analytics_events_link_time_idx on public.analytics_events (link_id, occurred_at desc);

create function private.increment_link_click_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.link_id is not null then
    update public.links set click_count = click_count + 1 where id = new.link_id;
  end if;
  return null;
end;
$$;

revoke all on function private.increment_link_click_count() from public;

create trigger analytics_events_count_click
  after insert on public.analytics_events
  for each row execute function private.increment_link_click_count();

-- ---------------------------------------------------------------------------
-- Grants: least privilege for the API roles
-- ---------------------------------------------------------------------------

revoke all on table public.hubs, public.sections, public.links, public.analytics_events
  from anon, authenticated;

grant select on table public.hubs, public.sections, public.links to anon, authenticated;

-- Only these columns can be supplied; id and occurred_at are always set by the database.
grant insert (link_id, referrer, country, device,
              utm_source, utm_medium, utm_campaign, utm_term, utm_content)
  on table public.analytics_events to anon, authenticated;

grant select, insert, update, delete on table
  public.hubs, public.sections, public.links, public.analytics_events
  to service_role;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.hubs enable row level security;
alter table public.sections enable row level security;
alter table public.links enable row level security;
alter table public.analytics_events enable row level security;

create policy "Published hubs are public"
  on public.hubs for select
  to anon, authenticated
  using (is_published);

-- The subquery is itself filtered by the hubs policy, so a section is only
-- visible when its hub is visible too.
create policy "Published sections of public hubs are public"
  on public.sections for select
  to anon, authenticated
  using (is_published and exists (select 1 from public.hubs h where h.id = sections.hub_id));

create policy "Published links in public sections are public"
  on public.links for select
  to anon, authenticated
  using (is_published and exists (select 1 from public.sections s where s.id = links.section_id));

-- Clicks can only be recorded against a link the visitor can actually see.
create policy "Anyone can record a click on a public link"
  on public.analytics_events for insert
  to anon, authenticated
  with check (
    link_id is not null
    and exists (select 1 from public.links l where l.id = analytics_events.link_id)
  );

-- No select, update or delete policies on analytics_events: those are denied.
