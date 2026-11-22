-- Hub Zero schema v2: content fields for the Stage 2 pages, image storage,
-- and server-side click recording with rate limiting.
--
-- Click recording moves behind the website's /go redirect. The public API can no
-- longer insert click rows directly (anyone holding the public key could inflate
-- the counts); only the server, using the secret key, can call record_click().

-- ---------------------------------------------------------------------------
-- Content fields
-- ---------------------------------------------------------------------------

-- Profile links shown on the hero card, e.g. [{"label": "LinkedIn", "url": "https://..."}].
alter table public.hubs
  add column social_links jsonb not null default '[]'::jsonb
    constraint hubs_social_links_shape check (
      jsonb_typeof(social_links) = 'array'
      and not jsonb_path_exists(
        social_links,
        '$[*] ? (!exists(@.label) || !exists(@.url) || !(@.url like_regex "^https://"))'
      )
    );

-- Long-form text for a section page (paragraphs separated by a blank line),
-- and an optional form slot, e.g. the Kit sign-up form.
alter table public.sections
  add column body text check (char_length(body) <= 5000),
  add column form_provider text check (form_provider in ('kit')),
  add column form_id text check (char_length(form_id) <= 100);

-- A second line under a link's title (a book's subtitle), and a group heading
-- that gathers links inside a section (a book series).
alter table public.links
  add column subtitle text check (char_length(subtitle) <= 160),
  add column group_label text check (char_length(group_label) <= 80);

-- New columns are covered by the existing table-level select grants and policies.

-- ---------------------------------------------------------------------------
-- Image storage: public read by URL, uploads only through the dashboard
-- (or the secret key). No storage policies, so the public API cannot list,
-- upload, change or delete files.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hub-media', 'hub-media', true, 2097152,
        array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Click recording
-- ---------------------------------------------------------------------------

drop policy "Anyone can record a click on a public link" on public.analytics_events;
revoke insert on table public.analytics_events from anon, authenticated;

-- Per-visitor counters for one-minute windows. visitor_hash is a keyed hash of
-- IP address, browser and date made by the server; it is never stored with the
-- clicks and rows are deleted after an hour.
create table private.click_rate_limits (
  visitor_hash text not null check (char_length(visitor_hash) between 16 and 128),
  window_start timestamptz not null,
  hits         integer not null default 1,
  primary key (visitor_hash, window_start)
);

create index click_rate_limits_window_idx on private.click_rate_limits (window_start);

-- Records one click if the link is public and the visitor is under 10 clicks a
-- minute. Returns true when the click was counted.
create function public.record_click(
  p_link_id      uuid,
  p_visitor_hash text,
  p_referrer     text default null,
  p_country      text default null,
  p_device       text default null,
  p_utm_source   text default null,
  p_utm_medium   text default null,
  p_utm_campaign text default null,
  p_utm_term     text default null,
  p_utm_content  text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hits integer;
begin
  if not exists (
    select 1
    from public.links l
    join public.sections s on s.id = l.section_id
    join public.hubs h on h.id = s.hub_id
    where l.id = p_link_id and l.is_published and s.is_published and h.is_published
  ) then
    return false;
  end if;

  insert into private.click_rate_limits as r (visitor_hash, window_start)
  values (p_visitor_hash, date_trunc('minute', now()))
  on conflict (visitor_hash, window_start) do update set hits = r.hits + 1
  returning r.hits into v_hits;

  delete from private.click_rate_limits where window_start < now() - interval '1 hour';

  if v_hits > 10 then
    return false;
  end if;

  insert into public.analytics_events
    (link_id, referrer, country, device, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
  values
    (p_link_id, p_referrer, p_country, p_device, p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content);

  return true;
end;
$$;

revoke all on function public.record_click(uuid, text, text, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.record_click(uuid, text, text, text, text, text, text, text, text, text)
  to service_role;
