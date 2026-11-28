-- 28 Nov 2026: gift season for the books (approved by Imran: "1, 2 & 3 agreed").
--
-- 1. /books gets a gift panel above the list (code: magazine-grid.tsx, links tagged "gift"):
--    a. "Give the Trilogy": Amazon's add-to-cart link with the three Redacted Series PAPERBACKS
--       (Before History B0GZ6CZ6QR, Before Religion B0H12732HM, Before Us B0HJTSV727) and the
--       Associates tag. Amazon shows a "Please confirm" page listing the three books before anything
--       is added (tested 28 Nov). The button reads "Add all 3 to Amazon cart".
--    b. "Printable gift card": a two-page PDF (the series card and a Before History card, 5 x 7 in,
--       cut marks, no links of any kind) on R2: media.imransyednaqvi.com/books/redacted-series-gift-card.pdf.
--    The panel shows the covers of the books in its group (The Redacted Series). /books#gift lands on it.
--    After the season: set is_published = false on both rows and the panel disappears.
-- 2. /picks gets Before History (paperback) under Books and Guides, as a gift, saying it is Imran's own book.
--
-- No prices anywhere. Safe to run twice (each insert skips an anchor that already exists).

begin;

-- 1a and 1b: the gift panel on /books.
insert into public.links
  (section_id, title, subtitle, url, image_url, description, tags, is_affiliate, disclosure_line,
   group_label, order_index, is_published, anchor)
select '21454f83-c288-4033-86dd-e8bcac679496', v.title, v.subtitle, v.url, null, v.description, v.tags,
       v.is_affiliate, v.disclosure_line, 'The Redacted Series', v.order_index, true, v.anchor
from (values
  ('gift',
   'Give the Trilogy',
   'All three Redacted Series paperbacks, added to your Amazon cart in one step',
   'https://www.amazon.com/gp/aws/cart/add.html?AssociateTag=world25374-20&tag=world25374-20&ASIN.1=B0GZ6CZ6QR&Quantity.1=1&ASIN.2=B0H12732HM&Quantity.2=1&ASIN.3=B0HJTSV727&Quantity.3=1',
   'For the reader who always asks how they knew. Before History, Before Religion and Before Us each stand on their own; together they follow one question from the first carved pillars to the minds that left no trace. Amazon shows you the three books and asks you to confirm before anything goes in your cart.',
   array['gift', 'amazon'], true, '(paid link)', -20),
  ('gift-card',
   'Printable gift card',
   null,
   'https://media.imransyednaqvi.com/books/redacted-series-gift-card.pdf',
   'Paperbacks arrive in an Amazon box, sometimes after the day. Print this card (one for the series, one for Before History), write a note, and give it on time.',
   array['gift', 'download'], false, null::text, -10)
) as v(anchor, title, subtitle, url, description, tags, is_affiliate, disclosure_line, order_index)
where not exists (
  select 1 from public.links l
  where l.section_id = '21454f83-c288-4033-86dd-e8bcac679496' and l.anchor = v.anchor
);

-- 2: Before History on /picks (paperback), under Books and Guides, before Joseph's Well (410).
insert into public.links
  (section_id, title, url, image_url, description, tags, is_affiliate, disclosure_line,
   group_label, order_index, is_published, anchor)
select '2775e69f-7f7e-4ed4-93eb-16bf609c5c28',
       'Before History (Paperback)',
       'https://www.amazon.com/dp/B0GZ6CZ6QR?tag=world25374-20',
       'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/books/before-history.webp',
       'My own book, Book One of The Redacted Series: the advanced cultures before writing, from Göbekli Tepe''s fifteen-ton pillars on. 75 peer-reviewed sources, every claim tier-tagged; not aliens, not Atlantis. A gift for the history lover who has read everything. The whole trilogy is on the Books page.',
       array['gifts-2026', 'amazon', 'ai-image', 'book'], true, '(paid link)',
       'Books and Guides', 400, true, 'before-history'
where not exists (
  select 1 from public.links l
  where l.section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28' and l.anchor = 'before-history'
);

commit;

select s.slug, l.order_index, l.anchor, l.title, l.is_affiliate, l.disclosure_line
from public.links l join public.sections s on s.id = l.section_id
where l.anchor in ('gift', 'gift-card', 'before-history')
order by s.slug, l.order_index;
