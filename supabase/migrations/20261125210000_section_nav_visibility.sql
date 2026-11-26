-- Hub Zero schema v9: a section can stay off the menu but still have its page.
-- show_in_nav = false keeps the section out of the site menu; its page still works
-- for anyone with the link (an "unlisted" section). Pair it with home_display =
-- 'hidden' to keep it off the home page too. Grants and row-level security on
-- sections are unchanged (table-level select).

alter table public.sections
  add column if not exists show_in_nav boolean not null default true;

comment on column public.sections.show_in_nav is 'false = not in the site menu (the page still works by link). Pair with home_display = hidden for an unlisted section.';
