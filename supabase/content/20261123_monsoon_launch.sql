-- Launch content for the Monsoon theme (Imran, 23 Nov 2026). Run once; safe to re-run.
--
-- 1. Identity line in title case, "Lieutenant Colonel (Retired)" in full.
-- 2. The valley photograph under the home page's sky (hub-media/imran/hero-valley.webp).
-- 3. Links to the salon site and its photography gallery where the text names them
--    (paragraph text may carry [label](https://…) links; the site renders them).
-- 4. Headings and titles capitalised per word (Imran's rule, 23 Nov).

update public.hubs
set identity_statement = $t$Operations, Supply Chain and Commercial Leader in Defence Manufacturing. Lieutenant Colonel (Retired), Pakistan Army. Author of Four Books. Islamabad.$t$,
    cover_image_url = 'https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/hero-valley.webp'
where username = 'imran';

update public.sections
set excerpt = $t$Imran Syed Naqvi, who writes as Imran Naqvi, is a retired Pakistan Army officer, electronics engineer and writer. He served twenty-five years in the Corps of Electrical and Mechanical Engineers, including the UN peacekeeping mission in the Democratic Republic of Congo, where the question behind The Redacted Series began. He holds the Tamgha-i-Imtiaz (Military) and an Executive MBA from IBA Karachi, and after the Army directed sales and operations at Pakistan's leading armoured-vehicle manufacturer. He is now Director Projects at Belkom Solutions and a consultant to Momentum Logistics. He writes from Islamabad, and with his wife Qurat-ul-Ain co-founded [Aini's Salon & Studio](https://ainisalonstudio.com/), where both work as [photographers](https://ainisalonstudio.com/studio-media).$t$,
    body = replace(body,
      $t$With his wife Qurat-ul-Ain he co-founded Aini's Salon & Studio, a beauty salon and professional photography studio in Bahria Town; both are working photographers,$t$,
      $t$With his wife Qurat-ul-Ain he co-founded [Aini's Salon & Studio](https://ainisalonstudio.com/), a beauty salon and professional photography studio in Bahria Town; both are working [photographers](https://ainisalonstudio.com/studio-media),$t$),
    cta_label = 'Full Profile'
where slug = 'about' and hub_id = (select id from public.hubs where username = 'imran');

-- Beyond Work: the salon and the studio gallery as links on the entries.
update public.profile_entries set url = 'https://ainisalonstudio.com/'
where id = 'a726bbc5-d29d-545a-a72f-3f6a891c4bb7' and kind = 'interest';
update public.profile_entries set url = 'https://ainisalonstudio.com/studio-media'
where id = 'fccd4091-8db3-5019-8401-1376973a9ba1' and kind = 'interest';

-- Capitalisation.
update public.profile_entries set group_label = 'The Redacted Series Notes'
where section_id = 'a4fca489-9a67-4f0d-8434-6598e11992e2' and group_label = 'The Redacted Series notes';
update public.profile_entries set group_label = 'Video Essays'
where section_id = 'a4fca489-9a67-4f0d-8434-6598e11992e2' and group_label = 'Video essays';
update public.profile_entries set title = 'Doggerland: The Country That Drowned in the North Sea'
where id = '5916b25c-8a11-5ada-bf60-945594799283';
update public.profile_entries set title = 'MUL.APIN: Babylonian Astronomy Before the Telescope'
where section_id = 'a4fca489-9a67-4f0d-8434-6598e11992e2' and kind = 'publication' and title = 'MUL.APIN: Babylonian astronomy before the telescope';
