-- Hub Zero schema v3: the long-scroll home page and the /profile page.
--
-- Everything here is generic, so any LinkHub hub can use it:
--   * sections.home_display decides how a section appears on the home page:
--     'inline' (shown in full on the home page), 'tile' (a link tile), or 'hidden'.
--   * sections.excerpt is the short version an inline section shows on the home page.
--   * sections.cta_label / cta_href set the "read more" link under that excerpt.
--   * profile_entries holds a professional record (experience, education, awards,
--     publications, thesis, research projects, downloadable documents) for any
--     section; the page lays them out in a fixed order.
--   * Storage bucket hub-documents holds public PDFs (a CV, a thesis).

-- ---------------------------------------------------------------------------
-- Sections: home page presentation
-- ---------------------------------------------------------------------------

alter table public.sections
  add column home_display text not null default 'tile'
    check (home_display in ('inline', 'tile', 'hidden')),
  add column excerpt text check (char_length(excerpt) <= 800),
  add column cta_label text check (char_length(cta_label) between 1 and 60),
  add column cta_href text
    check (cta_href ~ '^(https://|/(?!/))' and char_length(cta_href) <= 2048),
  add constraint sections_cta_pair check ((cta_label is null) = (cta_href is null));

comment on column public.sections.home_display is 'inline = shown in full on the home page; tile = link tile; hidden = not on the home page.';
comment on column public.sections.excerpt is 'Short version shown when the section is inline on the home page.';
comment on column public.sections.cta_href is 'Target of the link under the excerpt: a path on this site (/profile) or an https URL.';

-- ---------------------------------------------------------------------------
-- Profile entries
-- ---------------------------------------------------------------------------

create table public.profile_entries (
  id             uuid primary key default gen_random_uuid(),
  section_id     uuid not null references public.sections (id) on delete cascade,
  kind           text not null
                   check (kind in ('experience', 'education', 'award', 'publication', 'thesis', 'project', 'document')),
  title          text not null check (char_length(title) between 1 and 200),
  organisation   text check (char_length(organisation) <= 160),
  start_date     date,
  end_date       date,
  date_precision text not null default 'month' check (date_precision in ('year', 'month', 'day')),
  is_current     boolean not null default false,
  body           text check (char_length(body) <= 3000),
  image_url      text check (image_url ~ '^https://'),
  url            text check (url ~* '^(https?://|mailto:|/(?!/))' and char_length(url) <= 2048),
  file_url       text check (file_url ~ '^https://'),
  order_index    integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint profile_entries_dates check (end_date is null or start_date is null or end_date >= start_date),
  -- Amazon links belong in public.links, where the affiliate disclosure is enforced.
  constraint profile_entries_no_amazon check (
    url !~* '^https?://([a-z0-9-]+\.)*(amazon\.[a-z.]+|amzn\.[a-z]+)(/|:|$)'
  )
);

comment on table public.profile_entries is 'Professional record shown on a section page: experience, education, awards, publications, thesis, projects, documents.';
comment on column public.profile_entries.date_precision is 'How dates are shown: year (2024), month (Dec 2024) or day (3 Dec 2024).';
comment on column public.profile_entries.is_current is 'Shows the period as "to present".';
comment on column public.profile_entries.url is 'A link: an https URL or a path on this site such as /books.';
comment on column public.profile_entries.file_url is 'A downloadable file, e.g. a PDF in the hub-documents bucket.';

create index profile_entries_section_order_idx on public.profile_entries (section_id, kind, order_index);

create trigger profile_entries_set_updated_at
  before update on public.profile_entries
  for each row execute function private.set_updated_at();

revoke all on table public.profile_entries from anon, authenticated;
grant select on table public.profile_entries to anon, authenticated;
grant select, insert, update, delete on table public.profile_entries to service_role;

alter table public.profile_entries enable row level security;

-- Visible when published and its section is visible (which in turn needs its hub visible).
create policy "Published entries in public sections are public"
  on public.profile_entries for select
  to anon, authenticated
  using (is_published and exists (select 1 from public.sections s where s.id = profile_entries.section_id));

-- ---------------------------------------------------------------------------
-- Documents: public PDFs, uploaded through the dashboard only
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hub-documents', 'hub-documents', true, 26214400, array['application/pdf'])
on conflict (id) do nothing;
