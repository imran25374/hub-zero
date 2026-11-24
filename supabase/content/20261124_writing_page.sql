-- Hub Zero content, 24 Nov 2026: the writing page (/writing).
-- Needs schema v5 (20261124120000_writing_media.sql). Safe to run twice.
--
-- Publications leave the profile page for a page of their own: four LinkedIn
-- articles with their banners at LinkedIn's own ratio, five video essays that
-- play on the page from media.imransyednaqvi.com, the nine-panel carousel
-- "The Architecture of the Invisible", and the MBA thesis. The books stay on
-- /books, so the four book entries go. Design: canvas "Hub Zero: complete site
-- in the approved theme", Writing artboard (approved 23 Nov).

-- 1. The section, between Books and Picks in the menu; shown on the home page
--    as its four newest pieces.
update public.sections set order_index = 4 where id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28'; -- picks
update public.sections set order_index = 5 where id = '49896536-28b6-40f3-9cc5-6639351414eb'; -- signup
update public.sections set order_index = 6 where id = 'a4fca489-9a67-4f0d-8434-6598e11992e2'; -- profile

insert into public.sections
  (id, hub_id, slug, title, nav_label, description, excerpt, cta_label, cta_href, layout_id, order_index, is_published, home_display)
values (
  '7b1f3c2e-5d4a-4e8f-9c21-3a6b8d0e4f57', '0c24743e-90f5-4183-8484-46bc12f2e019', 'writing',
  $t$Writing and Research$t$, $t$Writing$t$,
  $t$Articles, video essays and a carousel from the research behind the books, one piece from a career in defence manufacturing, and an MBA thesis. The books have their own page.$t$,
  $t$Articles, video essays and a carousel from the research behind the books, one piece from a career in defence manufacturing, and an MBA thesis. The latest four:$t$,
  'All Writing', '/writing',
  'portfolio-mosaic', 3, true, 'inline'
)
on conflict (id) do update set
  title = excluded.title, nav_label = excluded.nav_label, description = excluded.description,
  excerpt = excluded.excerpt, cta_label = excluded.cta_label, cta_href = excluded.cta_href,
  layout_id = excluded.layout_id, order_index = excluded.order_index, home_display = excluded.home_display;

-- 2. The four book entries leave the profile; the books have /books.
delete from public.profile_entries
where id in ('e7e2d25f-7624-5c79-a754-4034a7d64df1', 'e249169e-e5da-5b55-b6f3-15c40304c2f7',
             '351c351c-a2bb-5f9f-b20a-5e2e8b1542ec', 'a363b4e2-373c-518e-883e-b244554d26fa');

-- 3. Everything published moves to the writing page.
update public.profile_entries
set section_id = '7b1f3c2e-5d4a-4e8f-9c21-3a6b8d0e4f57'
where section_id = 'a4fca489-9a67-4f0d-8434-6598e11992e2' and kind in ('publication', 'thesis');

-- 4. Articles: title case, banner at its own size, the approved one-line briefs.
update public.profile_entries set group_label = 'Articles', order_index = 1,
  title = $t$Lessons From the Field: When the Pakistan Military Built Its Own ERP$t$,
  body = $t$A home-grown ERP for an entire force, seen from inside the rollout: more about people and process than software.$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/article-erp.webp', image_width = 1536, image_height = 1024
where id = 'd7311c5e-774d-518e-8f4e-dab385486a96';

update public.profile_entries set group_label = 'Articles', order_index = 2,
  title = $t$The Acceleration Problem: Why All of Science Emerged in the Last Three Percent of Human History$t$,
  body = $t$Modern humans existed for 300,000 years and built almost nothing that lasted; in the last 10,000 they built everything. The standard explanations do not cover the gap.$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/article-acceleration.webp', image_width = 1200, image_height = 627
where id = 'd56607ba-3bcb-5766-aff6-2982bc7fc35f';

update public.profile_entries set group_label = 'Articles', order_index = 3,
  title = $t$The Cold That Froze the Mammoths: Notes on the Younger Dryas$t$,
  body = $t$A 1,200-year return to ice-age cold, the megafauna extinction, and the three contested triggers.$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/article-mammoths.webp', image_width = 1200, image_height = 627
where id = 'a9523f27-ae96-5b0c-be70-41babf9688e5';

update public.profile_entries set group_label = 'Articles', order_index = 4,
  title = $t$The Site That Should Not Exist: Notes on Göbekli Tepe$t$,
  body = $t$An 11,600-year-old monumental building raised by people who had not yet begun to farm.$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/article-gobekli.webp', image_width = 1600, image_height = 900
where id = '14ab1d98-4407-5e36-967e-44bb7527b140';

-- 5. Video essays, newest first: played on the page from R2, poster frames on Supabase.
update public.profile_entries set group_label = 'Video Essays', order_index = 11,
  title = $t$Doggerland: The Country That Drowned in the North Sea$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/poster-doggerland.webp', image_width = 720, image_height = 1280,
  video_url = 'https://media.imransyednaqvi.com/writing/doggerland.mp4', duration_seconds = 65
where id = '5916b25c-8a11-5ada-bf60-945594799283';

update public.profile_entries set group_label = 'Video Essays', order_index = 13,
  title = $t$MUL.APIN: Babylonian Astronomy Before the Telescope$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/poster-mulapin.webp', image_width = 720, image_height = 1280,
  video_url = 'https://media.imransyednaqvi.com/writing/mulapin.mp4', duration_seconds = 33
where id = '4e8681fc-64f8-5a8a-968e-485c3854aee8';

-- The three reels Imran supplied on 23 Nov (titles coined by Claude, approved in the
-- design). Dates are the months of the video files; LinkedIn post links to follow.
insert into public.profile_entries
  (id, section_id, kind, group_label, title, start_date, date_precision, body, image_url, image_width, image_height, video_url, duration_seconds, order_index)
values
  ('6c0d2a9e-1f3b-4c7d-8e5a-2b9f7d1c3e60', '7b1f3c2e-5d4a-4e8f-9c21-3a6b8d0e4f57', 'publication', 'Video Essays',
   $t$290,000 Years of Nothing, Then Everything$t$, date '2026-06-01', 'month',
   $t$From ochre at Blombos Cave to Göbekli Tepe, Giza, the printed book, the smartphone and the James Webb telescope: why it all happened in the last 10,000 years.$t$,
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/poster-acceleration.webp', 720, 1280,
   'https://media.imransyednaqvi.com/writing/acceleration.mp4', 86, 10),
  ('9e4b7c1d-3a2f-4d8e-b6c5-7f1a3e9d2b48', '7b1f3c2e-5d4a-4e8f-9c21-3a6b8d0e4f57', 'publication', 'Video Essays',
   $t$12,900 Years Ago: The Cold That Emptied a Continent$t$, date '2026-05-01', 'month',
   $t$A sudden temperature plunge, the Younger Dryas, and 35 genera gone from North America. The cause is still contested.$t$,
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/poster-extinction.webp', 720, 1280,
   'https://media.imransyednaqvi.com/writing/extinction.mp4', 32, 12),
  ('2f8a5d3c-7b1e-4f9a-a3d6-5c2e8b4f7a19', '7b1f3c2e-5d4a-4e8f-9c21-3a6b8d0e4f57', 'publication', 'Video Essays',
   $t$Plimpton 322: Pythagoras, 1,200 Years Early$t$, date '2026-05-01', 'month',
   $t$A clay tablet made in Babylon around 1800 BC lists Pythagorean triples, some with five-digit numbers too large to have been guessed.$t$,
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/poster-plimpton.webp', 720, 1280,
   'https://media.imransyednaqvi.com/writing/plimpton.mp4', 18, 14)
on conflict (id) do nothing;

-- 6. The carousel post: nine square panels, turned on the page.
update public.profile_entries set group_label = 'Carousel', order_index = 20,
  body = $t$What holds the universe together, and what it is made of that we cannot see: the cosmic web, gravity as the weakest and only unshielded force, the five-27-68 split of ordinary matter, dark matter and dark energy, the 2015 gravitational wave, and our address in Laniakea. From the research for Signs on the Horizon.$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-1.webp', image_width = 1080, image_height = 1080,
  gallery_urls = array[
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-1.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-2.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-3.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-4.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-5.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-6.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-7.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-8.webp',
    'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/invisible-9.webp']
where id = 'd7566913-3df7-5df1-b690-f381d77c2a97';

-- 7. The thesis: cover page and the structural model, with the PDF.
update public.profile_entries set
  title = $t$Implications of Flexible Work Arrangements on Employees' Non-Work-Related Outcomes$t$,
  image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/thesis-cover.webp', image_width = 745, image_height = 1053,
  gallery_urls = array['https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/writing/thesis-model.webp']
where id = '56ef1c5b-a72b-50c7-b255-5fbf5303ecb7';
