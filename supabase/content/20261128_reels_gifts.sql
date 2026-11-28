-- 9 holiday gift reels (28 Nov 2026) for @studiotools.marketing, as DRAFTS.
-- One a day, 1-9 Dec, at 11:00 US Eastern (16:00 UTC); times editable in the planner.
-- Images: AI-generated in Higgsfield (GPT Image 2.6); is_ai_generated applies Instagram's AI label
-- and every frame with a product image carries an "AI-generated" note. Videos on R2, covers on Supabase Storage.
-- Captions: #ad first, no prices, no Amazon links, 3 hashtags each.
-- "promotes" holds the deep link to use as the button link if a reel is boosted:
--   /picks?item=<anchor> opens /picks scrolled to that product, highlighted (Meta's UTM tags don't break it).
-- Safe to run twice.

insert into public.social_posts
  (id, hub_id, channel, kind, scheduled_at, caption, media_urls, cover_url, share_to_feed, is_affiliate, is_ai_generated, promotes, status)
values
  ('d6a207b8-eaca-5ff4-8647-891081865fa5', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-01T16:00:00Z',
   $c$#ad Nex Playground: a motion-play console that plugs into the TV. A built-in camera follows your moves, so the whole family plays with no controllers. Five games included. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#GiftIdeas #FamilyGameNight #KidsGifts$c$,
   array['https://media.imransyednaqvi.com/social/gift-nex-playground.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-nex-playground-cover.jpg',
   true, true, true, $c$Nex Playground (Kids and Family, ASIN B0D2JGYX3F). Boost button link: https://imransyednaqvi.com/picks?item=nex-playground$c$, 'draft'),
  ('a3468fde-ad99-59b8-8a15-affc441f934f', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-02T16:00:00Z',
   $c$#ad Ninja Air Fryer XL with Max Crisp: 6.5 quarts and six functions, from air fry and roast to bake and dehydrate. The basket holds up to 5 lb of fries. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#GiftIdeas #AirFryer #KitchenGifts$c$,
   array['https://media.imransyednaqvi.com/social/gift-ninja-air-fryer-xl.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-ninja-air-fryer-xl-cover.jpg',
   true, true, true, $c$Ninja Air Fryer XL (6.5 Qt) (Home, ASIN B0CS3V8M9H). Boost button link: https://imransyednaqvi.com/picks?item=ninja-air-fryer-xl$c$, 'draft'),
  ('ba272883-9bda-5c30-aaf3-7e740024b636', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-03T16:00:00Z',
   $c$#ad LANEIGE Lip Sleeping Mask in Berry: the overnight lip mask with shea and murumuru seed butters, in a 20 g jar with its own applicator. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#StockingStuffers #KBeauty #BeautyGifts$c$,
   array['https://media.imransyednaqvi.com/social/gift-laneige-lip-mask.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-laneige-lip-mask-cover.jpg',
   true, true, true, $c$LANEIGE Lip Sleeping Mask (Berry) (Beauty, ASIN B07XXPHQZK). Boost button link: https://imransyednaqvi.com/picks?item=laneige-lip-mask$c$, 'draft'),
  ('b147e9ff-bb77-510c-8d1e-53f926ab4f97', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-04T16:00:00Z',
   $c$#ad Flip 7: With a Vengeance, the standalone sequel to Flip 7. Flip cards one at a time and bank your points before you bust, now with take-that action cards. Ages 8 and up, 3 or more players. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#GameNight #GiftIdeas #CardGames$c$,
   array['https://media.imransyednaqvi.com/social/gift-flip-7-vengeance.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-flip-7-vengeance-cover.jpg',
   true, true, true, $c$Flip 7: With a Vengeance (Kids and Family, ASIN B0GK9XK2N4). Boost button link: https://imransyednaqvi.com/picks?item=flip-7-vengeance$c$, 'draft'),
  ('5328b7da-8851-5f7e-af73-0e050ec5ae47', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-05T16:00:00Z',
   $c$#ad Bose SoundLink Micro (2nd Gen): a pocket-size Bluetooth speaker, waterproof and dustproof (IP67), with up to 12 hours of battery and a strap to clip it to a bag or a bike. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#TechGifts #Bose #GiftIdeas$c$,
   array['https://media.imransyednaqvi.com/social/gift-bose-soundlink-micro-2.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-bose-soundlink-micro-2-cover.jpg',
   true, true, true, $c$Bose SoundLink Micro (2nd Gen) (Tech, ASIN B0FDLD34V5). Boost button link: https://imransyednaqvi.com/picks?item=bose-soundlink-micro-2$c$, 'draft'),
  ('df2998c2-1837-5ed4-939a-ac4e753a7107', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-06T16:00:00Z',
   $c$#ad Govee RGBIC Floor Lamp Basic: a slim 54-inch smart lamp with multicolour effects, music sync and app or voice control. Made for corners and small rooms. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#RoomDecor #SmartHome #GiftIdeas$c$,
   array['https://media.imransyednaqvi.com/social/gift-govee-floor-lamp.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-govee-floor-lamp-cover.jpg',
   true, true, true, $c$Govee RGBIC Floor Lamp (Home, ASIN B0F3XL19JW). Boost button link: https://imransyednaqvi.com/picks?item=govee-floor-lamp$c$, 'draft'),
  ('f64d099f-bfed-5f9b-bd01-1bd2445e0817', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-07T16:00:00Z',
   $c$#ad Summer Fridays Lip Butter Balm in Pink Sugar: shea and murumuru seed butters with a sheer pink tint and shine, in a squeeze tube. More shades on the listing. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#StockingStuffers #LipBalm #BeautyGifts$c$,
   array['https://media.imransyednaqvi.com/social/gift-summer-fridays-balm.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-summer-fridays-balm-cover.jpg',
   true, true, true, $c$Summer Fridays Lip Butter Balm (Beauty, ASIN B0C42HJRBF). Boost button link: https://imransyednaqvi.com/picks?item=summer-fridays-balm$c$, 'draft'),
  ('edc4b12a-6772-5b9e-8613-0a5c065a1394', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-08T16:00:00Z',
   $c$#ad Anker Power Bank, 20,000 mAh, with a built-in USB-C cable and a small display. It charges three devices at once, laptops included. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#TravelGifts #TechGifts #StockingStuffers$c$,
   array['https://media.imransyednaqvi.com/social/gift-anker-power-bank.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-anker-power-bank-cover.jpg',
   true, true, true, $c$Anker Power Bank 20,000 mAh (Tech, ASIN B0CXDXP8VR). Boost button link: https://imransyednaqvi.com/picks?item=anker-power-bank$c$, 'draft'),
  ('3a01daa0-74ba-5235-a038-21cdb84fbd3a', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'reel', '2026-12-09T16:00:00Z',
   $c$#ad UNIHAND rechargeable hand warmers: a set of two with three heat levels, which clip together into one palm-sized warmer. Check today's price at the link in bio.

As an Amazon Associate I earn from qualifying purchases.

#StockingStuffers #WinterGifts #GiftIdeas$c$,
   array['https://media.imransyednaqvi.com/social/gift-unihand-hand-warmers.mp4'],
   'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/gifts/gift-unihand-hand-warmers-cover.jpg',
   true, true, true, $c$UNIHAND Rechargeable Hand Warmers (Home, ASIN B0CG65PYBV). Boost button link: https://imransyednaqvi.com/picks?item=unihand-hand-warmers$c$, 'draft')
on conflict (id) do nothing;

select to_char(scheduled_at at time zone 'UTC', 'DD Mon HH24:MI') as utc, kind, status, left(caption, 50) as caption, promotes
from public.social_posts
where id in ('d6a207b8-eaca-5ff4-8647-891081865fa5', 'a3468fde-ad99-59b8-8a15-affc441f934f', 'ba272883-9bda-5c30-aaf3-7e740024b636', 'b147e9ff-bb77-510c-8d1e-53f926ab4f97', '5328b7da-8851-5f7e-af73-0e050ec5ae47', 'df2998c2-1837-5ed4-939a-ac4e753a7107', 'f64d099f-bfed-5f9b-bd01-1bd2445e0817', 'edc4b12a-6772-5b9e-8613-0a5c065a1394', '3a01daa0-74ba-5235-a038-21cdb84fbd3a')
order by scheduled_at;
