-- 26 Nov 2026: an anchor for each book, so a pin or post can land on its book:
-- imransyednaqvi.com/books#before-religion. Uses schema v8 (links.anchor, applied 25 Nov).
-- The page shows the anchor once the magazine-grid change is deployed.
-- Keep these stable: live Pinterest pins point at them. Safe to run twice.
-- The result grid shows the four books with their anchors.

update public.links as l
set anchor = v.anchor
from (values
  ('90052c3b-d1d1-4b29-9a48-c119f1d16d55', 'before-history'),
  ('c98a2392-7229-4e1c-a175-fe5c8c7ad29f', 'before-religion'),
  ('f7a918fd-b8c6-43af-84ca-97ad07a1f391', 'before-us'),
  ('9e3f68ea-7314-4fd2-8058-c3908e3f4e87', 'signs-on-the-horizon')
) as v(id, anchor)
where l.id = v.id::uuid;

select title, anchor
from public.links
where section_id = '21454f83-c288-4033-86dd-e8bcac679496'
order by order_index;
