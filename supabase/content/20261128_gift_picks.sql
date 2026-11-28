-- 28 Nov 2026: holiday gift picks for /picks.
--
-- 1. Regroups the picks into five categories, each with its own page once the
--    category-page code is live: Tech, Home, Beauty, Kids and Family, Books and Guides
--    (/picks/tech, /picks/home, /picks/beauty, /picks/kids-and-family, /picks/books-and-guides).
-- 2. Adds nine gift picks chosen from Amazon US Best Sellers on 28 Nov 2026
--    (Store ID world25374-20), each with an AI-generated picture already uploaded to
--    hub-media/imran/picks/pick-<anchor>.jpg and the ai-image tag.
-- 3. Rewrites "this week" ranking lines from 25 Nov, which go stale after Cyber Monday,
--    and the /picks intro, which named Black Friday and Cyber Monday.
--
-- Anchors are stable once shared: ads use /picks?item=<anchor>, pins /picks#<anchor>.
-- Safe to run twice: inserts skip an anchor that already exists.
-- The result grid lists every pick by category, in page order.

begin;

-- 1. Categories and order (the page shows groups in order_index order).
update public.links as l
set group_label = v.group_label, order_index = v.order_index
from (values
  ('fire-tv-stick-4k',     'Tech', 10),
  ('echo-dot',             'Tech', 20),
  ('airpods-pro-3',        'Tech', 30),
  ('airtag-2',             'Tech', 60),
  ('apple-watch-s12',      'Tech', 70),
  ('beats-solo-4',         'Tech', 80),
  ('kindle-paperwhite',    'Tech', 90),
  ('stanley-quencher',     'Home', 130),
  ('owala-freesip',        'Home', 140),
  ('aura-carver',          'Home', 150),
  ('alpha-grillers',       'Home', 170),
  ('astroai-l7',           'Home', 180),
  ('cosrx-snail-essence',  'Beauty', 230),
  ('biodance-mask',        'Beauty', 240),
  ('medicube-pads',        'Beauty', 250),
  ('picassotiles',         'Kids and Family', 330),
  ('josephs-well',         'Books and Guides', 410)
) as v(anchor, group_label, order_index)
where l.section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28'
  and l.anchor = v.anchor;

-- 2. New picks. URLs carry the Associates tag; the page sends clicks through /go.
insert into public.links
  (section_id, title, url, image_url, description, tags, is_affiliate, disclosure_line,
   group_label, order_index, is_published, anchor)
select '2775e69f-7f7e-4ed4-93eb-16bf609c5c28', v.title, v.url,
       'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/picks/pick-' || v.anchor || '.jpg',
       v.description, array['gifts-2026', 'amazon', 'ai-image'], true, '(paid link)',
       v.group_label, v.order_index, true, v.anchor
from (values
  ('bose-soundlink-micro-2', 'Tech', 40,
   'Bose SoundLink Micro (2nd Gen)',
   'https://www.amazon.com/dp/B0FDLD34V5?tag=world25374-20',
   'Bose''s pocket-size Bluetooth speaker: waterproof and dustproof (IP67), up to 12 hours of battery, and a strap to clip it to a bag or a bike.'),
  ('anker-power-bank', 'Tech', 50,
   'Anker Power Bank, 20,000 mAh, Built-In USB-C Cable',
   'https://www.amazon.com/dp/B0CXDXP8VR?tag=world25374-20',
   'A 20,000 mAh power bank with a built-in USB-C cable and a small display. Charges three devices at once, laptops included. A travel gift that gets used.'),
  ('ninja-air-fryer-xl', 'Home', 110,
   'Ninja Air Fryer XL with Max Crisp (6.5 Qt, AF181)',
   'https://www.amazon.com/dp/B0CS3V8M9H?tag=world25374-20',
   'A 6.5-quart, 6-in-1 air fryer: Max Crisp, air fry, roast, bake, reheat and dehydrate. The basket holds up to 5 lb of fries.'),
  ('govee-floor-lamp', 'Home', 120,
   'Govee RGBIC Floor Lamp Basic (Champagne)',
   'https://www.amazon.com/dp/B0F3XL19JW?tag=world25374-20',
   'A slim 54-inch smart floor lamp with multicolour effects, music sync and app or voice control (Alexa, Google Assistant). Made for corners and small rooms.'),
  ('unihand-hand-warmers', 'Home', 160,
   'UNIHAND Rechargeable Hand Warmers (2-Pack)',
   'https://www.amazon.com/dp/B0CG65PYBV?tag=world25374-20',
   'Two rechargeable hand warmers with three heat levels that clip together into one palm-sized warmer. A winter stocking stuffer.'),
  ('laneige-lip-mask', 'Beauty', 210,
   'LANEIGE Lip Sleeping Mask (Berry)',
   'https://www.amazon.com/dp/B07XXPHQZK?tag=world25374-20',
   'The overnight lip mask in Berry, with shea and murumuru seed butters and a small applicator. A small gift that keeps selling.'),
  ('summer-fridays-balm', 'Beauty', 220,
   'Summer Fridays Lip Butter Balm (Pink Sugar)',
   'https://www.amazon.com/dp/B0C42HJRBF?tag=world25374-20',
   'The lip balm in a squeeze tube: shea and murumuru seed butters with a sheer pink tint and shine. Several shades on the listing.'),
  ('nex-playground', 'Kids and Family', 310,
   'Nex Playground',
   'https://www.amazon.com/dp/B0D2JGYX3F?tag=world25374-20',
   'A motion-play console that plugs into the TV: a built-in camera follows players'' movements, so the family plays with no controllers. Five games included; more with a Play Pass subscription.'),
  ('flip-7-vengeance', 'Kids and Family', 320,
   'Flip 7: With a Vengeance (Card Game)',
   'https://www.amazon.com/dp/B0GK9XK2N4?tag=world25374-20',
   'The standalone sequel to Flip 7: flip cards one at a time and bank your points before you bust, now with take-that action cards. 3+ players, ages 8 and up, about 20 minutes.')
) as v(anchor, group_label, order_index, title, url, description)
where not exists (
  select 1 from public.links l
  where l.section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28' and l.anchor = v.anchor
);

-- 3. Lines that named a ranking "this week" (true on 25 Nov) become lasting ones.
update public.links as l
set description = v.description
from (values
  ('apple-watch-s12', 'Apple''s newest watch, in the 42 mm GPS model.'),
  ('airpods-pro-3', 'Active noise cancellation, live translation and a USB-C case.'),
  ('stanley-quencher', 'The 40 oz tumbler with handle and straw that fits a car cup holder.'),
  ('medicube-pads', 'Dual-textured toner pads for gentle exfoliation.'),
  ('biodance-mask', 'Overnight hydrogel sheet masks, four to a box.'),
  ('josephs-well', 'A printed guide, with a video presentation, to collecting water at home during drought.')
) as v(anchor, description)
where l.section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28'
  and l.anchor = v.anchor;

update public.sections
set description = 'What''s selling fast right now, rounded up for holiday gifting: tech, home, beauty, and gifts for kids and family. Prices change by the hour, so check today''s price at each link. These are affiliate links: if you buy through one, I may earn a commission at no extra cost to you.'
where id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28';

commit;

select group_label, order_index, anchor, title
from public.links
where section_id = '2775e69f-7f7e-4ed4-93eb-16bf609c5c28'
order by order_index;
