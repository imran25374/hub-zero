-- 28 Nov 2026: first "Skills and Software" pick on /picks, from Digistore24.
--
-- Chosen from the top 100 English offers on the Digistore24 marketplace (sorted by popularity),
-- after reading the sales pages: no health claims, no income claims, no collapse or fear framing.
-- TubeMagic: AI tools for YouTube creators, $47/month subscription, 50% recurring commission,
-- 8.94% cancellation rate. Affiliate ID imransyednaqvi53a2 travels in the #aff part of the link
-- (the vendor's own format); /go keeps it because browsers carry a redirect's #fragment.
--
-- Digistore24 picks are marked "#ad" (Amazon picks say "(paid link)"). No picture yet: the card
-- shows as text, like Joseph's Well. No price on the page, as with every pick.
-- The Serger course (also cleared) waits for its vendor to approve the affiliate request.
-- Safe to run twice.

insert into public.links
  (section_id, title, url, image_url, description, tags, is_affiliate, disclosure_line,
   group_label, order_index, is_published, anchor)
select '2775e69f-7f7e-4ed4-93eb-16bf609c5c28',
       'TubeMagic: AI Tools for YouTube Creators',
       'https://tubemagic.com/ds#aff=imransyednaqvi53a2',
       null,
       'A web app of AI tools for YouTube creators: script drafts, titles, descriptions, thumbnails and keyword research in one place. A monthly subscription you can cancel at any time, with a 30-day money-back guarantee.',
       array['digistore24', 'software'], true, '#ad',
       'Skills and Software', 510, true, 'tubemagic'
where not exists (
  select 1 from public.links l
  where l.section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28' and l.anchor = 'tubemagic'
);

select group_label, order_index, anchor, title, disclosure_line
from public.links
where section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28' and group_label in ('Books and Guides', 'Skills and Software')
order by order_index;
