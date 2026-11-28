-- Gift reel for The Redacted Series (28 Nov 2026), as a DRAFT for 10 Dec 2026, 11:00 US Eastern (16:00 UTC).
-- 15 s, Monsoon dark-teal style; cover art is AI-generated (note on every frame; is_ai_generated sets Instagram's label).
-- Video on R2 (social/gift-redacted-series.mp4), cover on Supabase Storage. Caption: #ad first, no prices, no Amazon links, 3 hashtags.
-- "promotes" holds the boost link: /books, where the gift panel ("Gift the Trilogy") sits at the top.
-- Safe to run twice.

insert into public.social_posts
  (id, hub_id, channel, kind, scheduled_at, caption, media_urls, cover_url, share_to_feed, is_affiliate, is_ai_generated, promotes, status)
values
  ('fd74ffa0-e3a9-5ee9-aa12-d2d83c7ba8c5', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-10T16:00:00Z',
   $c$#ad For the history lover who's read everything: The Redacted Series. Before History, Before Religion and Before Us each stand on their own; together they follow one question, from Göbekli Tepe's pillars to the minds that left no trace. The Books page has one button that puts all three paperbacks in your cart, and a printable gift card for under the tree. Link in bio.

As an Amazon Associate I earn from qualifying purchases.

#GiftIdeas #AncientHistory #BookGifts$c$,
   array['https://media.imransyednaqvi.com/social/gift-redacted-series.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-redacted-series-cover.jpg',
   true, true, true, $c$The Redacted Series trilogy, paperbacks. Boost button link: https://imransyednaqvi.com/books (the gift panel is at the top)$c$, 'draft')
on conflict (id) do nothing;

select to_char(scheduled_at at time zone 'UTC', 'DD Mon HH24:MI') as utc, kind, status, left(caption, 60) as caption
from public.social_posts where id = 'fd74ffa0-e3a9-5ee9-aa12-d2d83c7ba8c5';
