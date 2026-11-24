-- Hub Zero content, 24 Nov 2026: LinkedIn posts for the three reels added with
-- the writing page, with the day of each post (read from the post id; they match
-- the dates of the video files). Safe to run twice.

update public.profile_entries
set url = 'https://www.linkedin.com/feed/update/urn:li:activity:7473752191799906305/',
    start_date = date '2026-06-19', date_precision = 'day'
where id = '6c0d2a9e-1f3b-4c7d-8e5a-2b9f7d1c3e60'; -- 290,000 Years of Nothing, Then Everything

update public.profile_entries
set url = 'https://www.linkedin.com/feed/update/urn:li:activity:7465022747677523968/',
    start_date = date '2026-05-26', date_precision = 'day'
where id = '9e4b7c1d-3a2f-4d8e-b6c5-7f1a3e9d2b48'; -- 12,900 Years Ago: The Cold That Emptied a Continent

update public.profile_entries
set url = 'https://www.linkedin.com/feed/update/urn:li:activity:7462153324595720192/',
    start_date = date '2026-05-18', date_precision = 'day'
where id = '2f8a5d3c-7b1e-4f9a-a3d6-5c2e8b4f7a19'; -- Plimpton 322: Pythagoras, 1,200 Years Early
