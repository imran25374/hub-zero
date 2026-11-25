-- Hub Zero schema v8: a stable anchor for each link, so a pin, post or email can
-- point at one item on a section page (imransyednaqvi.com/picks#fire-tv-stick-4k).
-- The page renders it as the item's HTML id. Kebab-case, unique within a section,
-- and kept stable once shared: titles can change, anchors should not.
-- Grants and row-level security on links are unchanged (table-level select).

alter table public.links
  add column anchor text check (anchor ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(anchor) <= 60);

create unique index links_section_anchor_idx on public.links (section_id, anchor) where anchor is not null;

comment on column public.links.anchor is 'Kebab-case id for linking to this item on its section page (#anchor). Unique per section; keep stable once shared.';
