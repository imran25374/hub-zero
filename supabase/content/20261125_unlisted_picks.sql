-- Picks becomes unlisted: off the menu and the home page, still at /picks for
-- Instagram and Pinterest visitors. Includes schema v9 (safe to run twice).
alter table public.sections
  add column if not exists show_in_nav boolean not null default true;
comment on column public.sections.show_in_nav is 'false = not in the site menu (the page still works by link). Pair with home_display = hidden for an unlisted section.';

update public.sections
   set show_in_nav = false, home_display = 'hidden'
 where id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28';

select slug, show_in_nav, home_display from public.sections order by order_index;
