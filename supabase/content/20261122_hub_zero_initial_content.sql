-- Hub Zero: initial content load (Stage 2).
--
-- Source of truth: the project doc claude/hub-zero-content.md. Copy marked as a
-- draft there is loaded as it stands; edit it later in the database (Table Editor)
-- and the site updates within about a minute, no redeploy.
--
-- Safe to run twice: rows have fixed ids and existing rows are left untouched.
-- Images live in the public Storage bucket hub-media under imran/.

insert into public.hubs (id, username, display_name, identity_statement, profile_image_url, social_links)
values (
  '0c24743e-90f5-4183-8484-46bc12f2e019', 'imran', 'Imran Naqvi',
  $t$Author of The Redacted Series and Signs on the Horizon. Engineer, photographer, retired army officer. Islamabad.$t$,
  'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/profile.webp',
  '[{"label": "LinkedIn", "url": "https://www.linkedin.com/in/imran-syed-naqvi-3813b953"},
    {"label": "Instagram", "url": "https://www.instagram.com/some.shades.of.grey/"}]'::jsonb
)
on conflict (id) do nothing;

insert into public.sections (id, hub_id, slug, title, description, body, layout_id, order_index, is_published, form_provider)
values
  ('13e6b946-eae3-4030-aa82-8c12e3961dcd', '0c24743e-90f5-4183-8484-46bc12f2e019', 'about', $t$About Imran$t$, $t$Engineer, retired army officer and photographer, and how a question first asked in Congo became four books.$t$, $t$Imran Syed Naqvi, who writes as Imran Naqvi, is a retired Pakistan Army officer, electronics engineer and writer. His books sit at the boundary between history and science, and ask the questions neither field answers on its own.

Commissioned in 1998 after an electronics engineering degree from NUST, he served twenty-five years in the Corps of Electrical and Mechanical Engineers: technical support for air-defence and communications systems, military warehousing and supply chains, officer training, and in 2011–13 the UN peacekeeping mission in the Democratic Republic of Congo, where the question behind The Redacted Series began as an unsubmitted essay. He holds the Tamgha-i-Imtiaz (Military), the UN Medal, and an Executive MBA from IBA Karachi. After the Army he directed sales and operations at Pakistan's leading armoured-vehicle manufacturer.

He writes from Islamabad. With his wife Qurat-ul-Ain he co-founded Aini's Salon & Studio, a beauty salon and professional photography studio in Bahria Town; both are working photographers, and he designed the studio's website and built its point-of-sale system himself. Away from the page he draws in charcoal.$t$, 'hero-split', 1, true, null),
  ('21454f83-c288-4033-86dd-e8bcac679496', '0c24743e-90f5-4183-8484-46bc12f2e019', 'books', $t$Books$t$, $t$Investigations into what came before us, built on sources and labelled by evidence: established, contested, or the author's own inference.$t$, null, 'magazine-grid', 2, true, null),
  ('2775e69f-7f7e-4ed4-93eb-16bf609c5c28', '0c24743e-90f5-4183-8484-46bc12f2e019', 'picks', $t$Reading Recommendations$t$, $t$The sources the books stand on, in English translation.$t$, null, 'dashboard', 3, false, null),
  ('49896536-28b6-40f3-9cc5-6639351414eb', '0c24743e-90f5-4183-8484-46bc12f2e019', 'signup', $t$Join the Readers$t$, $t$Get The Question at Lake Kivu: how an unsubmitted army essay became four books. It isn't in any of them.$t$, null, 'hero-split', 4, true, $t$kit$t$)
on conflict (id) do nothing;

insert into public.links (id, section_id, title, subtitle, url, image_url, description, tags, is_affiliate, disclosure_line, group_label, order_index)
values
  ('90052c3b-d1d1-4b29-9a48-c119f1d16d55', '21454f83-c288-4033-86dd-e8bcac679496', $t$Before History$t$, $t$The Advanced Ancient Civilizations They Don't Teach in School$t$, 'https://www.amazon.com/dp/B0GWXPY5PL?tag=world25374-20', 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/books/before-history.webp', $t$For 290,000 years modern humans left almost nothing behind; then hunter-gatherers at Göbekli Tepe raised fifteen-ton carved pillars. Eight lines of evidence, 75 peer-reviewed sources, every claim tier-tagged. Not ancient aliens, not Atlantis: the gaps the standard model leaves open.$t$, '{book}', true, '(paid link)', $t$The Redacted Series$t$, 1),
  ('c98a2392-7229-4e1c-a175-fe5c8c7ad29f', '21454f83-c288-4033-86dd-e8bcac679496', $t$Before Religion$t$, $t$The Sacred Knowledge They Preserved in the World's Oldest Traditions$t$, 'https://www.amazon.com/dp/B0GX32LQ4G?tag=world25374-20', 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/books/before-religion.webp', $t$Ten traditions on every inhabited continent, with no documented contact between the most distant, each remember beings before humanity, a catastrophe, survivors, and knowledge passed forward. Read in their oldest authenticated layers, with the ice cores and ancient DNA as an independent witness.$t$, '{book}', true, '(paid link)', $t$The Redacted Series$t$, 2),
  ('f7a918fd-b8c6-43af-84ca-97ad07a1f391', '21454f83-c288-4033-86dd-e8bcac679496', $t$Before Us$t$, $t$The Minds That Came Before Us and Left No Trace in the Ground$t$, 'https://www.amazon.com/dp/B0HJ19P3H7?tag=world25374-20', 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/books/before-us.webp', $t$For nearly two million years, beings with brains as large as ours made the same tools the same way; then farming, cities and writing arrived in a few thousand years. The fossil record, the oldest traditions, and the physics of the electromagnetic spectrum, read together. Can be read on its own.$t$, '{book}', true, '(paid link)', $t$The Redacted Series$t$, 3),
  ('9e3f68ea-7314-4fd2-8058-c3908e3f4e87', '21454f83-c288-4033-86dd-e8bcac679496', $t$Signs on the Horizon$t$, $t$The Beings Before Us, Investigated Through Archaeology, Scripture and Physics$t$, 'https://www.amazon.com/dp/B0HS7C9Q62?tag=world25374-20', 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/books/signs-on-the-horizon.webp', $t$Before the first man, the angels asked whose blood would be shed on the earth. The 430,000-year-old murder in a Spanish pit, the pillars of Göbekli Tepe, what the Quran and its classical commentators say about the earth before Adam, and what physics can say about beings made of fire. 543 pages, 79 Quranic passages in the original Arabic, 507 endnotes.$t$, '{book}', true, '(paid link)', $t$Standalone$t$, 4)
on conflict (id) do nothing;
