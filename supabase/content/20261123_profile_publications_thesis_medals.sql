-- Hub Zero content, 23 Nov 2026 (evening): the rest of the /profile page and the hero line.
-- Source: claude/hub-zero-profile-content.md and Imran's choice of hero line, 23 Nov.
-- Needs schema v4 (20261123200000_profile_entry_groups.sql). Safe to run twice.

-- 1. Hero identity line, recruiter-first (Imran, 23 Nov).
update public.hubs
set identity_statement = $t$Operations, supply chain and commercial leader in defence manufacturing. Lt Col (Retd), Pakistan Army. Author of four books. Islamabad.$t$
where id = '0c24743e-90f5-4183-8484-46bc12f2e019';

-- 2. No CV download on the site (decision of 23 Nov): the CV entry goes.
delete from public.profile_entries where section_id = 'a4fca489-9a67-4f0d-8434-6598e11992e2' and kind = 'document';

-- 3. Medals: photo and caption.
update public.profile_entries
set body = $t$Conferred 22 March 2023 by the President of Pakistan, in recognition of meritorious service and devotion to duty.$t$,
    image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/medal-tamgha-i-imtiaz.webp',
    end_date = date '2023-03-22', date_precision = 'year'
where id = '6635dcbc-b640-57e9-bc97-e72b15301bed';

update public.profile_entries
set body = $t$Awarded 23 March 2013 for twelve months' service with MONUSCO, the UN stabilisation mission in the Democratic Republic of the Congo. The numeral 2 on the ribbon bar marks two six-month qualifying periods.$t$,
    image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/medal-un.webp',
    start_date = date '2012-05-01', end_date = date '2013-05-01', date_precision = 'month'
where id = 'f3d96ac2-5687-54b3-b675-c8f4f79b0d09';

-- 4. Publications in four groups: the professional article, the books, the series notes, the video essays.
update public.profile_entries
set group_label = 'Books', order_index = order_index + 1
where section_id = 'a4fca489-9a67-4f0d-8434-6598e11992e2' and kind = 'publication' and url = '/books' and group_label is null;

insert into public.profile_entries
  (id, section_id, kind, group_label, title, start_date, date_precision, body, url, order_index)
values
  ('d7311c5e-774d-518e-8f4e-dab385486a96', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Professional$t$, $t$Lessons from the Field: When the Pakistan Military Built Its Own ERP$t$, date '2026-06-12', 'day', $t$What a force-wide, home-grown ERP rollout taught about people and process, from inside it.$t$, $t$https://www.linkedin.com/pulse/lessons-from-field-when-pakistan-military-built-its-own-syed-naqvi-hgqbf/$t$, 1),
  ('d56607ba-3bcb-5766-aff6-2982bc7fc35f', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$The Redacted Series notes$t$, $t$The Acceleration Problem: Why All of Science Emerged in the Last Three Percent of Human History$t$, date '2026-06-01', 'day', $t$300,000 years of almost nothing lasting, then everything in the last 10,000.$t$, $t$https://www.linkedin.com/pulse/acceleration-problem-why-all-science-emerged-last-three-syed-naqvi-mhcaf/$t$, 6),
  ('a9523f27-ae96-5b0c-be70-41babf9688e5', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$The Redacted Series notes$t$, $t$The Cold That Froze the Mammoths: Notes on the Younger Dryas$t$, date '2026-05-19', 'day', $t$The 1,200-year cold reversal, the megafauna extinction and the three contested triggers.$t$, $t$https://www.linkedin.com/pulse/cold-froze-mammoths-imran-syed-naqvi-cttyf/$t$, 7),
  ('14ab1d98-4407-5e36-967e-44bb7527b140', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$The Redacted Series notes$t$, $t$The Site That Should Not Exist: Notes on Göbekli Tepe$t$, date '2026-05-11', 'day', $t$An encounter with an 11,600-year-old building raised before farming.$t$, $t$https://www.linkedin.com/pulse/site-should-exist-notes-g%C3%B6bekli-tepe-imran-syed-naqvi-2aejc/$t$, 8),
  ('d7566913-3df7-5df1-b690-f381d77c2a97', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Video essays$t$, $t$The Architecture of the Invisible$t$, date '2026-09-29', 'day', $t$The cosmic web, and why the weakest force holds it together. From the research for Signs on the Horizon.$t$, $t$https://www.linkedin.com/posts/imran-syed-naqvi-3813b953_the-architecture-of-the-invisible-signs-ugcPost-7510653714026893312-r8OD/$t$, 9),
  ('5916b25c-8a11-5ada-bf60-945594799283', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Video essays$t$, $t$Doggerland: the country that drowned in the North Sea$t$, date '2026-06-02', 'day', $t$A land larger than Britain, lost to the Storegga tsunami and rising seas around 6200 BC.$t$, $t$https://www.linkedin.com/posts/imran-syed-naqvi-3813b953_eight-thousand-years-ago-a-country-drowned-ugcPost-7467545757714231298-AL1M/$t$, 10),
  ('4e8681fc-64f8-5a8a-968e-485c3854aee8', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'publication', $t$Video essays$t$, $t$MUL.APIN: Babylonian astronomy before the telescope$t$, date '2026-05-22', 'day', $t$Sixty-six named stars and constellations on two clay tablets, 2,600 years before Galileo.$t$, $t$https://www.linkedin.com/posts/imran-syed-naqvi-3813b953_ancientastronomy-babylonianastronomy-mulapin-ugcPost-7463563351902777345-jptv/$t$, 11)
on conflict (id) do nothing;

-- 5. The MBA thesis, with the full text as a PDF.
insert into public.profile_entries
  (id, section_id, kind, title, organisation, end_date, date_precision, body, file_url, order_index)
values (
  '56ef1c5b-a72b-50c7-b255-5fbf5303ecb7', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'thesis', $t$Implications of Flexible Work Arrangements on Employees' Nonwork-Related Outcomes, e.g., 'Home & Leisure Crafting'$t$,
  $t$Executive MBA project report, Institute of Business Administration (IBA), Karachi$t$,
  date '2023-12-01', 'year', $t$Does letting people choose when and where they work change what they do outside work? This study asked that question in Pakistan, where flexible work arrangements are rare and, where they exist, usually mean remote work rather than flexible hours. A survey of 172 employees, analysed with structural equation modelling, found that flexibility has no direct effect on home and leisure activities. Its effect runs entirely through employee wellbeing: flexibility raises social, psychological and physical wellbeing, and wellbeing in turn drives what people do at home and in their leisure. The pattern matches findings from Western workplaces despite very different work cultures. The report closes with recommendations for regulators and employers on introducing flexible arrangements in Pakistani organisations.

Supervisor: Dr. Yasir Mansoor Kundi, Department of Management, IBA. 65 pages; a survey of 172 respondents in Pakistan, analysed with structural equation modelling in SmartPLS.$t$,
  'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-documents/imran/mba-thesis-flexible-work-arrangements.pdf', 1
)
on conflict (id) do nothing;
