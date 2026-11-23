-- Remove the test clicks made on preview deployments before go-live.
--
-- Production has no click route until the go-live merge on 24 Nov 2026, so
-- every click recorded before then came from testing (on 22 Nov: one tagged
-- utm_source = claude-test and two review clicks). Previews built from
-- stage-2-launch onwards no longer record clicks.
delete from public.analytics_events
where occurred_at < timestamptz '2026-11-24 00:00:00+05';

-- Bring each link's click_count back in line with the clicks that remain.
update public.links l
set click_count = c.clicks
from (
  select l2.id, count(e.id) as clicks
  from public.links l2
  left join public.analytics_events e on e.link_id = l2.id
  group by l2.id
) c
where c.id = l.id and l.click_count <> c.clicks;
