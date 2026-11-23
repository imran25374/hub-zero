-- Hub Zero content, 23 Nov 2026: long-scroll home page and the /profile page.
-- Profile text from claude/hub-zero-profile-content.md (Imran's CV, with his answers of 23 Nov).
-- Safe to run twice: rows have fixed ids; updates set fixed values.

-- 1. Home page: About and Books in full (Join the Readers too, once it is published again).
update public.sections set home_display = 'inline'
where hub_id = '0c24743e-90f5-4183-8484-46bc12f2e019' and slug in ('about', 'books', 'signup');

-- The About text cut to one paragraph for the home page, with a link to the profile.
update public.sections
set excerpt = $t$Imran Syed Naqvi, who writes as Imran Naqvi, is a retired Pakistan Army officer, electronics engineer and writer. He served twenty-five years in the Corps of Electrical and Mechanical Engineers, including the UN peacekeeping mission in the Democratic Republic of Congo, where the question behind The Redacted Series began. He holds the Tamgha-i-Imtiaz (Military) and an Executive MBA from IBA Karachi, and after the Army directed sales and operations at Pakistan's leading armoured-vehicle manufacturer. He is now Director Projects at Belkom Solutions and a consultant to Momentum Logistics. He writes from Islamabad, and with his wife Qurat-ul-Ain co-founded Aini's Salon & Studio.$t$,
    cta_label = 'Full profile',
    cta_href = '/profile'
where id = '13e6b946-eae3-4030-aa82-8c12e3961dcd';

-- The About page: MONUSCO dates corrected to 2012–13, current roles added.
update public.sections
set body = replace(replace(body, 'and in 2011–13 the UN peacekeeping', 'and in 2012–13 the UN peacekeeping'),
                   'armoured-vehicle manufacturer.', 'armoured-vehicle manufacturer. He is now Director Projects at Belkom Solutions and a consultant to Momentum Logistics.')
where id = '13e6b946-eae3-4030-aa82-8c12e3961dcd' and position('Belkom' in body) = 0;

-- 2. Join the Readers is off until the Kit form exists (no tile, /signup answers 404).
update public.sections set is_published = false where id = '49896536-28b6-40f3-9cc5-6639351414eb';

-- 3. The profile page. Reached from the About link; no tile of its own.
insert into public.sections (id, hub_id, slug, title, nav_label, description, body, layout_id, order_index, is_published, home_display)
values (
  'a4fca489-9a67-4f0d-8434-6598e11992e2', '0c24743e-90f5-4183-8484-46bc12f2e019', 'profile', $t$Imran Syed Naqvi$t$, $t$Profile$t$,
  $t$Operations, Supply Chain and Commercial Leader | Defence Manufacturing and Engineering$t$,
  $t$Director-level operations, supply chain and commercial leader with more than 25 years across defence manufacturing, military engineering and government B2B sales. An electronics engineer with an Executive MBA, combining technical depth with full business ownership. As Director of HIT Armour Division at Margalla Heavy Industries Limited, led an organisation of more than 460 people with full P&L and pricing authority, built five corporate functions from scratch, won 62 contracts worth about USD 54 million and scaled output from 50 vehicles a year to 50 a month.

Retired from the Pakistan Army as a Lieutenant Colonel after a 25-year career in the Corps of Electrical and Mechanical Engineering, spanning fleet maintenance and repair, procurement and OEM management for air defence systems, quality assurance of procured stores, regional warehousing, officer education and UN peacekeeping. Decorated with the Tamgha-i-Imtiaz (Military). Now Director Projects at Belkom Solutions, evaluating defence systems from major OEMs and designing their acceptance tests, and Consultant to Momentum Logistics.$t$,
  'hero-split', 5, true, 'hidden'
)
on conflict (id) do nothing;

-- Entries. Pending (not loaded, so not shown): LinkedIn articles, MBA thesis,
-- research projects, medal photos. The CV entry stays unpublished until the
-- corrected PDF is uploaded.
insert into public.profile_entries
  (id, section_id, parent_id, kind, title, organisation, place, start_date, end_date, date_precision, is_current, body, url, order_index, is_published)
values
  ('faddf2eb-0d24-5991-8340-1d2d40993547', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'header', $t$Lieutenant Colonel (Retired), Pakistan Army | Tamgha-i-Imtiaz (Military)$t$, null, null, null, null, 'month', false, null, null, 1, true),
  ('cd29438e-0a8a-5f04-8673-158ed3e87414', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'header', $t$Islamabad, Pakistan$t$, null, null, null, null, 'month', false, null, null, 2, true),
  ('9e364c27-d878-5b78-8988-8e7f4e156eca', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'header', $t$Open to senior leadership roles in Pakistan and abroad.$t$, null, null, null, null, 'month', false, null, null, 3, true),
  ('b78a4154-1bf2-5599-b277-14cbdd0f417c', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'header', $t$info@imransyednaqvi.com$t$, null, null, null, null, 'month', false, null, $t$mailto:info@imransyednaqvi.com$t$, 4, true),
  ('d96f36ab-93c8-5918-ba3e-cc9c602a59c3', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'header', $t$LinkedIn$t$, null, null, null, null, 'month', false, null, $t$https://www.linkedin.com/in/imran-syed-naqvi-3813b953$t$, 5, true),
  ('e0b04f0e-2f52-5832-a6d0-1bbdd2e68489', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Grew HIT Armour Division's revenue from under PKR 1 billion a year to an annualised run-rate of about PKR 14 billion in 15 months, winning 62 contracts worth about USD 54 million with the armed forces, law enforcement agencies and an export customer.$t$, null, null, null, null, 'month', false, null, null, 1, true),
  ('9be5f432-17c5-58aa-91e6-848d96d11abf', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Scaled production from one line building 50 vehicles a year to ten lines building 50 a month, and delivered about 70 percent of contracted volume within 15 months.$t$, null, null, null, null, 'month', false, null, null, 2, true),
  ('028b6227-7ce9-5869-a23c-76b14f814e15', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Created the Supply Chain, Finance, Quality, HR and Legal functions and grew the organisation from about 55 to more than 460 people, leading through a General Manager and three Deputy General Managers.$t$, null, null, null, null, 'month', false, null, null, 3, true),
  ('f26a763a-1728-5c88-9370-89b6375d5374', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Built a supplier base across eight countries, qualified the first ballistic glass maker in Pakistan, brought composite armour into in-house manufacture and set up a new facility for hard armour plates and helmets.$t$, null, null, null, null, 'month', false, null, null, 4, true),
  ('a2a8dc8e-b3a9-59aa-8057-60ad6c173b2c', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Held critical spares availability at 100 percent for air defence, communications and electronic warfare systems at HQ Army Air Defence Command.$t$, null, null, null, null, 'month', false, null, null, 5, true),
  ('7258978b-23cf-5f12-8f3c-15ea91814243', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Cut warehouse operational errors by about 70 percent with barcode traceability, and improved planning and efficiency by over 50 percent at a Composite Inspection Depot.$t$, null, null, null, null, 'month', false, null, null, 6, true),
  ('b1f471a6-2444-5759-8f35-503bdd38efb3', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Worked formally with Saab Bofors (now Saab Dynamics) for two years as the Army's project lead on RBS 70 shelf-life extension, and designed test equipment for the TOW anti-tank missile.$t$, null, null, null, null, 'month', false, null, null, 7, true),
  ('1450baa1-d793-5fbd-baf6-23dac083c7bc', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'achievement', $t$Achieved ISO 9001:2015 and ISO 14001:2015 certification, initiated PAS 300 certification and specified an ERP with RFID tracking through every production stage.$t$, null, null, null, null, 'month', false, null, null, 8, true),
  ('c908fbf4-cc64-52b0-9006-7e0234d60e24', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Operations and Manufacturing$t$, null, null, null, null, 'month', false, $t$- Production scale-up
- Production planning and scheduling
- Make-or-buy
- Greenfield facility set-up
- Fleet maintenance, repair and overhaul
- Process redesign$t$, null, 1, true),
  ('99edcf86-d89e-505f-a8c5-c3b6fb2d10a1', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Supply Chain and Procurement$t$, null, null, null, null, 'month', false, $t$- End-to-end supply chain
- Strategic sourcing
- Supplier qualification and development
- Localisation of imports
- Negotiation and contracting
- Inventory and warehousing
- Working capital$t$, null, 2, true),
  ('cc40eb66-dbc3-5adc-a626-d05a283404db', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Commercial and Business Development$t$, null, null, null, null, 'month', false, $t$- P&L ownership
- Cost modelling and pricing
- Bid and tender management
- Government and defence key accounts
- Joint ventures and technology transfer
- After-sales support$t$, null, 3, true),
  ('e87a09d4-9d90-5159-a74d-63f582f7ebfb', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Quality, Inspection and Compliance$t$, null, null, null, null, 'month', false, $t$- Quality assurance of procured stores
- Inspection and acceptance testing
- Non-conformance management
- ISO 9001:2015
- ISO 14001:2015
- PAS 300$t$, null, 4, true),
  ('ca74f037-b83d-5723-8e63-7efcdda4db16', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Defence Technical$t$, null, null, null, null, 'month', false, $t$- Air defence systems
- Communications and electronic warfare
- Armoured vehicles and ballistic protection
- Missile test equipment and shelf-life extension
- OEM evaluation$t$, null, 5, true),
  ('0456de52-5999-598c-960f-4f3163446f5f', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Leadership and People$t$, null, null, null, null, 'month', false, $t$- Building functions from scratch
- Organisation design
- Recruitment and team development
- Training programmes
- Leading through managers
- Multinational stakeholders$t$, null, 6, true),
  ('11c98940-6ec1-5f98-8da9-90410cc5720d', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'skill_group', $t$Systems and Digital$t$, null, null, null, null, 'month', false, $t$- ERP specification and implementation
- RFID and barcode traceability
- KPI reporting
- Microsoft 365
- AI productivity tools$t$, null, 7, true),
  ('39e3c635-1ce4-531a-9181-00cec8df0f47', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'experience', $t$Director Projects$t$, $t$Belkom Solutions$t$, $t$Islamabad and Rawalpindi$t$, date '2026-07-01', null, 'month', true, $t$- Lead technical evaluation of defence systems from major US, European and Chinese OEMs against Pakistan Army requirements, across air defence, electronic warfare and bridging systems.
- Formulate acceptance testing regimes and inspect at OEM and user premises to verify that delivered systems meet the contract.
- Handle the technical side of the company's defence equipment sales to the Pakistan Army, from requirement analysis to acceptance.$t$, null, 1, true),
  ('84e6de60-fc3e-50bf-84cd-5bfa352ab91c', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'experience', $t$Consultant$t$, $t$Momentum Logistics$t$, $t$Pakistan$t$, date '2026-07-01', null, 'month', true, $t$- Develop the defence-sector pipeline and structure bids for import, customs clearance and logistics contracts with Pakistan Armed Forces procurement organisations.$t$, null, 2, true),
  ('13283b09-9405-5f91-b899-7bf24c8b1bcd', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'experience', $t$Director, HIT Armour Division$t$, $t$Margalla Heavy Industries Limited (MHIL)$t$, $t$Taxila$t$, date '2024-12-01', date '2026-03-01', 'month', false, $t$Headed MHIL's armoured vehicle and personal protection division, reporting to the CEO, with a General Manager, three Deputy General Managers and more than 460 staff. Full P&L and pricing authority over an annual cost base of about USD 40 million.

### Leadership and organisation
- Created the Supply Chain, Finance, Quality, HR and Legal functions, which did not previously exist, and recruited and developed the managers to lead them.
- Grew the organisation from about 55 to more than 460 people, setting the governance, reporting and KPIs for a business growing at speed.

### Commercial and customers
- Grew revenue from under PKR 1 billion a year to an annualised run-rate of about PKR 14 billion in 15 months, winning 62 contracts worth about USD 54 million with the armed forces, law enforcement agencies and an export customer.
- Owned commercial strategy, pricing and the tender pipeline, setting every bid price from cost models built on current supply chain and finance data.
- Managed government customer accounts end to end, from technical discussions and trials to contracting, phased delivery and after-sales repair.
- Led joint-venture programmes with technology transfer from Norinco and TDI Thailand.

### Manufacturing and operations
- Scaled production from one line building 50 vehicles a year to ten lines building 50 a month, delivering about 70 percent of contracted volume within 15 months.
- Built armoured vehicles to protection levels from B6 and B7 to STANAG Level 1 and Level 3.
- Set up a new in-house facility for hard armour plates and helmets around a plant procured from South Korea, with prototypes in Army QA testing at handover, and brought composite armour, the most expensive vehicle component, into in-house manufacture.

### Supply chain and sourcing
- Sourced, qualified and negotiated with suppliers across eight countries: armour steel from SSAB, Miilux and Nurol, ballistic glass from Emirates Glass and Kratos, and run-flat inserts from Hutchinson and Europlast.
- Qualified the first ballistic glass maker in Pakistan, reducing dependence on imports.
- Protected supply of critical replacement items against import delays of up to 12 months through forward procurement and inventory planning.
- Kept supply matched to phased deliveries on 62 contracts and managed working capital as it grew from PKR 2 billion to PKR 6 billion.

### Quality and systems
- Achieved ISO 9001:2015 and ISO 14001:2015 certification and initiated PAS 300 certification.
- Specified an ERP with RFID tracking through every production stage to move a paper-based business onto digital workflows.$t$, null, 3, true),
  ('307b14d4-3de6-524d-a5a1-89189f4d77f5', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'experience', $t$Assistant Director, Procurement, Planning and International Sourcing$t$, $t$Fabro International$t$, $t$Lahore$t$, date '2024-08-01', date '2024-12-01', 'month', false, $t$- Managed procurement planning and coordinated imports from multiple international sources, and implemented ERP-aligned production planning for material availability.
- Supported bid preparation and proposal coordination for technically complex procurement cases.$t$, null, 4, true),
  ('dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'experience', $t$Lieutenant Colonel (Retired)$t$, $t$Pakistan Army, Corps of Electrical and Mechanical Engineering (EME)$t$, null, date '1998-03-01', date '2023-10-01', 'month', false, $t$A 25-year career in the Corps of EME, which keeps the Army's vehicles, weapons and equipment in service, including a fleet of more than 70 wheeled vehicle types. Fleet maintenance and repair ran through almost every appointment. Awarded the Tamgha-i-Imtiaz (Military) by the President of Pakistan and the United Nations Medal.$t$, null, 5, true),
  ('a9f78604-a62e-5c70-be93-3793f58482e9', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Deputy Commandant, Composite Inspection Depot$t$, null, $t$Karachi$t$, date '2020-01-01', date '2023-03-01', 'month', false, $t$- Led quality assurance of procured defence stores and equipment: inspection and acceptance against contract specifications, non-conformance handling and supplier performance management.
- Reorganised team structures and introduced structured technical training for inspection staff, improving operational planning and efficiency by over 50 percent.
- Strengthened coordination with vendors and stakeholders, improving planning accuracy.$t$, null, 1, true),
  ('c9b0c6dc-fe7d-509c-84d2-611f81f707ef', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Director Technical Support, HQ Army Air Defence Command$t$, null, $t$Rawalpindi$t$, date '2017-10-01', date '2019-12-01', 'month', false, $t$- Directed procurement and OEM management for air defence, communications and electronic warfare systems, holding critical spares availability at 100 percent.
- Supported the testing and deployment of the LY-80 medium-range surface-to-air missile system.
- Maintained the readiness of V/UHF and HF communications and electronic warfare equipment, planning repair and overhaul programmes with international OEMs.
- Oversaw three workshops repairing 20 types of military vehicle.$t$, null, 2, true),
  ('8f2b1e9d-e13c-5427-a1b7-50ccf8d9882e', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Commandant, Military Warehouse for Technical Stores$t$, null, $t$Quetta$t$, date '2015-09-01', date '2017-09-01', 'month', false, $t$- Commanded a regional warehouse supplying spare parts to the region's military workshops, managing forecasting, procurement, receipt, storage and issue.
- Led ERP-aligned process redesign with barcode traceability, cutting operational errors by about 70 percent.
- Developed SOPs for procurement and inventory management and built reporting that gave leadership clear visibility of stock and compliance.$t$, null, 3, true),
  ('c10c9236-8bb1-5867-ae50-6f87d84d1862', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Liaison Officer, UN Peacekeeping (MONUSCO)$t$, null, $t$Democratic Republic of the Congo$t$, date '2012-05-01', date '2013-05-01', 'month', false, $t$Served as liaison officer in a multinational peacekeeping mission, working daily with contingents from 21 other countries. Awarded the United Nations Medal.$t$, null, 4, true),
  ('25b9f9b4-75b7-5fe6-ac68-fe7538d984e9', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Assistant Director Training, Higher Education and Professional Development$t$, null, $t$GHQ, Rawalpindi$t$, date '2008-01-01', date '2010-01-01', 'year', false, $t$- Managed higher education for Army officers, including MS and PhD nominations and selections in Pakistan and abroad, university placements and academic progress monitoring.
- Liaised with the Higher Education Commission, universities and academic institutions, and managed technical courses, seminars and skill development programmes.$t$, null, 5, true),
  ('5f9decb4-e383-56d3-afde-e29a8be927bd', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Second-in-Command of a Battalion$t$, null, null, date '2006-01-01', date '2008-01-01', 'year', false, $t$Second-in-Command of a battalion with four military vehicle and equipment workshops under command.$t$, null, 6, true),
  ('4fcdb105-aefe-5de6-a6cf-e8a57eba9001', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Project Lead, Missile Shelf-Life Extension, Precision Engineering Complex$t$, null, $t$Karachi$t$, date '2004-01-01', date '2006-01-01', 'year', false, $t$Served for two years as the Army's project lead: designed test equipment for the TOW anti-tank missile, and worked formally with Saab Bofors, Sweden (now Saab Dynamics), on RBS 70 shelf-life extension.$t$, null, 7, true),
  ('2a0771f6-0b07-5185-b97e-3f0fd1f54f26', 'a4fca489-9a67-4f0d-8434-6598e11992e2', 'dbfd2a31-54cc-5176-853d-1c9cb4e2efab', 'experience', $t$Military Vehicle and Equipment Workshop$t$, null, null, date '1998-01-01', date '2001-01-01', 'year', false, $t$Ran a military vehicle and equipment workshop as a Captain, covering engine and full vehicle overhauls.$t$, null, 8, true),
  ('8da72f76-e2da-5aed-91a5-c27d41a31ce9', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'education', $t$Executive MBA$t$, $t$Institute of Business Administration (IBA), Karachi$t$, null, null, date '2024-03-01', 'month', false, $t$Included a project management module with a grounding in PRINCE2 principles.$t$, null, 1, true),
  ('6dd267e4-74dd-5ad6-9ed0-d0b911c3faa0', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'education', $t$B.E. Electronics Engineering$t$, $t$National University of Sciences and Technology (NUST), Islamabad$t$, null, null, date '1997-01-01', 'year', false, null, null, 2, true),
  ('8c19e9a2-810a-5596-a848-d1d4425cffdd', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'training', $t$QMS ISO 9001:2015 Lead Auditor Training$t$, $t$Bureau Veritas$t$, null, null, date '2020-01-01', 'year', false, null, null, 1, true),
  ('f6a82833-e415-5aa5-b2a1-0ec3b6f6d877', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'training', $t$Logistics and Material Management$t$, $t$IBA Karachi and Allama Iqbal Open University$t$, null, null, date '2011-01-01', 'year', false, null, null, 2, true),
  ('2d1ea1ef-2681-5d1e-9b5f-216c28b0fe03', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'training', $t$Formal technical qualifications on anti-tank guided missiles and short-range surface-to-air missile systems$t$, null, null, null, null, 'month', false, null, null, 3, true),
  ('6635dcbc-b640-57e9-bc97-e72b15301bed', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'award', $t$Tamgha-i-Imtiaz (Military)$t$, null, null, null, null, 'month', false, $t$Awarded by the President of Pakistan for distinguished service$t$, null, 1, true),
  ('f3d96ac2-5687-54b3-b675-c8f4f79b0d09', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'award', $t$United Nations Medal$t$, null, null, null, null, 'month', false, $t$MONUSCO, UN peacekeeping mission in the Democratic Republic of the Congo$t$, null, 2, true),
  ('dedc6bd2-cdd4-5fe3-89d9-7dc08d8f2307', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'exposure', $t$Customer and sales engagement$t$, null, null, null, null, 'month', false, $t$Azerbaijan · Bangladesh · Kenya$t$, null, 1, true),
  ('5d5bfdd3-c259-58e3-9d8b-2fdf04d3c1fe', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'exposure', $t$Procurement and supplier engagement$t$, null, null, null, null, 'month', false, $t$China · South Africa · Australia · United Arab Emirates, with suppliers across eight countries at HIT$t$, null, 2, true),
  ('187746f3-5db4-55ec-8d2a-f377dcfdf072', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'exposure', $t$Defence exhibitions$t$, null, null, null, null, 'month', false, $t$IDEX, Abu Dhabi · IDEAS, Karachi$t$, null, 3, true),
  ('81b7e32e-8ff8-5aff-9ff2-92c83780671f', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'exposure', $t$International collaboration$t$, null, null, null, null, 'month', false, $t$Saab Bofors, Sweden (RBS 70) · UN peacekeeping with contingents from 21 countries$t$, null, 4, true),
  ('e7e2d25f-7624-5c79-a754-4034a7d64df1', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'publication', $t$Before History$t$, $t$The Redacted Series, book one$t$, null, date '2026-04-12', null, 'month', false, null, $t$/books$t$, 1, true),
  ('e249169e-e5da-5b55-b6f3-15c40304c2f7', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'publication', $t$Before Religion$t$, $t$The Redacted Series, book two$t$, null, date '2026-04-24', null, 'month', false, null, $t$/books$t$, 2, true),
  ('351c351c-a2bb-5f9f-b20a-5e2e8b1542ec', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'publication', $t$Before Us$t$, $t$The Redacted Series, book three$t$, null, date '2026-09-06', null, 'month', false, null, $t$/books$t$, 3, true),
  ('a363b4e2-373c-518e-883e-b244554d26fa', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'publication', $t$Signs on the Horizon$t$, $t$Standalone$t$, null, date '2026-11-19', null, 'month', false, null, $t$/books$t$, 4, true),
  ('d761fb02-d096-5bcb-b7be-df65f2a8b363', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'interest', $t$Author$t$, null, null, null, null, 'month', false, $t$Four books on Amazon: The Redacted Series (three books) and Signs on the Horizon.$t$, null, 1, true),
  ('a726bbc5-d29d-545a-a72f-3f6a891c4bb7', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'interest', $t$Entrepreneur$t$, null, null, null, null, 'month', false, $t$Co-founder of Aini's Salon & Studio, Rawalpindi.$t$, null, 2, true),
  ('fccd4091-8db3-5019-8401-1376973a9ba1', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'interest', $t$Photographer$t$, null, null, null, null, 'month', false, $t$Professional photographer with a photography diploma.$t$, null, 3, true),
  ('c6caca24-cb88-568e-ba0a-27867bd3b5b3', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'interest', $t$Technology$t$, null, null, null, null, 'month', false, $t$AI tools for digital media creation and productivity.$t$, null, 4, true),
  ('c7ba8567-b0e0-579c-b732-c0eed9796716', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'language', $t$English$t$, null, null, null, null, 'month', false, $t$fluent$t$, null, 1, true),
  ('03b375e3-1b23-5e50-b149-1e42eaa13b5e', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'language', $t$Urdu$t$, null, null, null, null, 'month', false, $t$native$t$, null, 2, true),
  ('ae9ce07b-42ae-5840-835f-05c1948786ac', 'a4fca489-9a67-4f0d-8434-6598e11992e2', null, 'document', $t$Download CV (PDF)$t$, null, null, null, null, 'month', false, null, null, 1, false)
on conflict (id) do nothing;
