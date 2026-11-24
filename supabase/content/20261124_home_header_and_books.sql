-- Home page header and books block (Imran, 24 Nov 2026). Safe to re-run.
--
-- 1. The identity line names no rank: "Former Army Officer". The rank stays on
--    the profile page header and in the About text.
-- 2. The books block on the home page is a cover carousel with one synopsis of
--    the books (sections.excerpt) and a button to /books, which keeps the
--    blurbs and buy buttons.

update public.hubs
set identity_statement = $t$Operations, Supply Chain and Commercial Leader in Defence Manufacturing. Former Army Officer. Author of Four Books. Islamabad.$t$
where username = 'imran';

update public.sections
set excerpt = $t$Four investigations into what came before us. The Redacted Series asks why modern humans built almost nothing for 290,000 years and then everything in the last ten thousand; what ten traditions on every inhabited continent remember about beings before humanity, a catastrophe and the knowledge that survived it; and what the fossil record and the oldest texts say about minds that left no trace in the ground. Signs on the Horizon takes the question into scripture and physics: what the Quran and its classical commentators say about the earth before Adam, and what physics can say about beings made of fire. Every claim carries an evidence label: established, contested, or the author's own inference.$t$,
    cta_label = 'All Four Books',
    cta_href = '/books'
where slug = 'books' and hub_id = (select id from public.hubs where username = 'imran');
