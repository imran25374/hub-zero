-- Hub Zero content, 23 Nov 2026: long-scroll home page and /profile placeholders.
-- Safe to run twice: rows have fixed ids; updates set fixed values.

-- 1. Home page: About, Books and Join the Readers appear in full; other sections as tiles.
update public.sections set home_display = 'inline'
where hub_id = '0c24743e-90f5-4183-8484-46bc12f2e019' and slug in ('about', 'books', 'signup');

-- The About text cut to one paragraph for the home page, with a link to the profile.
-- While the profile is unpublished the link falls back to /about.
update public.sections
set excerpt = $t$Imran Syed Naqvi, who writes as Imran Naqvi, is a retired Pakistan Army officer, electronics engineer and writer. He served twenty-five years in the Corps of Electrical and Mechanical Engineers, including the UN peacekeeping mission in the Democratic Republic of Congo, where the question behind The Redacted Series began. He holds the Tamgha-i-Imtiaz (Military) and an Executive MBA from IBA Karachi, and after the Army directed sales and operations at Pakistan's leading armoured-vehicle manufacturer. He writes from Islamabad, and with his wife Qurat-ul-Ain co-founded Aini's Salon & Studio.$t$,
    cta_label = 'Full profile',
    cta_href = '/profile'
where id = '13e6b946-eae3-4030-aa82-8c12e3961dcd';

-- 2. The profile section with PLACEHOLDER entries, so the page can be reviewed.
--    Production shows no section pages until the go-live merge. Before that
--    merge, either the real content is loaded or this section is unpublished.
insert into public.sections (id, hub_id, slug, title, description, body, layout_id, order_index, is_published, home_display)
values (
  'a4fca489-9a67-4f0d-8434-6598e11992e2', '0c24743e-90f5-4183-8484-46bc12f2e019', 'profile', $t$Profile$t$,
  $t$Career, education, awards and publications: the full professional record.$t$,
  $t$[Placeholder summary: three or four sentences from the CV on the roles Imran leads and what he brings to them.]$t$,
  'hero-split', 5, true, 'tile'
)
on conflict (id) do nothing;

insert into public.profile_entries
  (id, section_id, kind, title, organisation, start_date, end_date, date_precision, is_current, body, url, order_index)
values
  ('7c67ac41-a4eb-45e6-98f5-8d50ab7482c1', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Director Projects$t$, $t$Belkom Solutions$t$, date '2026-07-01', null, 'month', true, $t$[Placeholder: two or three lines from the CV.]$t$, null, 1),
  ('6af5074f-ac5c-4700-8a87-64b6a6ce17c7', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Consultant$t$, $t$Momentum Logistics$t$, date '2026-07-01', null, 'month', true, $t$[Placeholder: two or three lines from the CV.]$t$, null, 2),
  ('66fcb551-4917-4925-8fde-5bdd4f1d7bb2', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Director, Sales, Operations, Commercial and Programme Delivery$t$, $t$Margalla Heavy Industries$t$, date '2024-12-01', date '2026-03-01', 'month', false, $t$[Placeholder: two or three lines from the CV.]$t$, null, 3),
  ('17c7c7fb-49a0-4c9c-a09c-d4bb2db086d7', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Deputy Commandant$t$, $t$Composite Inspection Depot, Karachi$t$, date '2020-01-01', date '2023-01-01', 'year', false, $t$[Placeholder: two or three lines from the CV.]$t$, null, 4),
  ('835e4f42-c154-426d-877c-a5698b623372', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Director Technical Support$t$, $t$HQ Army Air Defence Command$t$, date '2017-01-01', date '2019-01-01', 'year', false, $t$[Placeholder: two or three lines from the CV.]$t$, null, 5),
  ('7e088d97-d0af-4d9c-8446-6765534d4dcf', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Commandant$t$, $t$Military Warehouse for Technical Stores, Quetta$t$, date '2015-01-01', date '2017-01-01', 'year', false, $t$[Placeholder: two or three lines from the CV.]$t$, null, 6),
  ('d8a79dfa-eb1d-4505-8a8b-d6e1fe7ac859', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'experience', $t$Chief Financial Officer, South Kivu Brigade$t$, $t$MONUSCO, UN mission in the DR Congo$t$, date '2012-01-01', date '2013-01-01', 'year', false, $t$[Placeholder: two or three lines from the CV.]$t$, null, 7),
  ('1140c46f-c3c8-4ea6-a3b1-78efb9937f14', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'education', $t$Executive MBA$t$, $t$Institute of Business Administration (IBA), Karachi$t$, date '2024-01-01', null, 'year', false, null, null, 1),
  ('7a46805d-e1ce-476a-b6d1-524e62e2b7d6', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'education', $t$BE Electronics Engineering$t$, $t$National University of Sciences and Technology (NUST)$t$, date '1997-01-01', null, 'year', false, null, null, 2),
  ('95fd6d4a-00a9-4d0f-8cea-36272e192381', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'award', $t$Tamgha-i-Imtiaz (Military)$t$, $t$Government of Pakistan$t$, null, null, 'year', false, $t$[Placeholder: caption and year; medal photo to follow.]$t$, null, 1),
  ('cefab78b-1536-4395-abbd-00e8c1b4cab9', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'award', $t$United Nations Medal$t$, $t$MONUSCO$t$, null, null, 'year', false, $t$[Placeholder: caption and year; medal photo to follow.]$t$, null, 2),
  ('9741007b-6687-4413-b123-4e941d18972b', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$[Placeholder: LinkedIn article title]$t$, $t$LinkedIn$t$, date '2026-01-01', null, 'month', false, null, $t$https://www.linkedin.com/in/imran-syed-naqvi-3813b953$t$, 1),
  ('34718193-5e09-44bf-ab79-aff7677ae0ac', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$[Placeholder: second LinkedIn article]$t$, $t$LinkedIn$t$, date '2025-06-01', null, 'month', false, null, $t$https://www.linkedin.com/in/imran-syed-naqvi-3813b953$t$, 2),
  ('5b4901ac-b234-4536-8c30-af6afc7b5f66', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Before History$t$, $t$The Redacted Series, book one$t$, date '2026-04-12', null, 'month', false, null, $t$/books$t$, 3),
  ('aee5384a-f05d-4728-b7f1-537889a7b09d', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Before Religion$t$, $t$The Redacted Series, book two$t$, date '2026-04-24', null, 'month', false, null, $t$/books$t$, 4),
  ('725aabc7-7507-4536-adfa-4fd56a41b1c3', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Before Us$t$, $t$The Redacted Series, book three$t$, date '2026-09-06', null, 'month', false, null, $t$/books$t$, 5),
  ('a4ed5c45-78e0-40b5-bc9b-c49a0b486c4c', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Signs on the Horizon$t$, $t$Standalone$t$, date '2026-11-19', null, 'month', false, null, $t$/books$t$, 6),
  ('318c02a2-ac6b-4be6-8262-f1adff136d08', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'thesis', $t$[Placeholder: MBA thesis title]$t$, $t$Institute of Business Administration (IBA), Karachi$t$, date '2024-01-01', null, 'year', false, $t$[Placeholder: the abstract, one or two paragraphs.]$t$, null, 1),
  ('a42c05cc-0778-4d22-9114-c60d346fb0dc', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'project', $t$[Placeholder: research project title]$t$, $t$Pakistan Army$t$, null, null, 'year', false, $t$[Placeholder: what the project was and what it achieved, as far as may be made public.]$t$, null, 1),
  ('d1316ca6-77dd-4e83-a094-db1bcab08ac4', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'document', $t$Download CV (PDF)$t$, null, null, null, 'year', false, null, null, 1)
on conflict (id) do nothing;
