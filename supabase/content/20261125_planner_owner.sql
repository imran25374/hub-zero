-- Imran's planner sign-in becomes the owner of Hub Zero, so the planner at
-- imransyednaqvi.com/planner shows him the hub's social posts.
-- Run after schema v7 (20261125150000_planner_access.sql) and after creating
-- the sign-in in Authentication → Users. Safe to run twice.

do $$
declare
  owner_id uuid;
begin
  select id into owner_id from auth.users where lower(email) = 'imran.syednaqvi@gmail.com';
  if owner_id is null then
    raise exception 'No sign-in for imran.syednaqvi@gmail.com yet: create it in Authentication → Users → Add user, then run this again.';
  end if;

  insert into public.hub_members (hub_id, user_id, role)
  values ('0c24743e-90f5-4183-8484-46bc12f2e019', owner_id, 'owner')
  on conflict (hub_id, user_id) do nothing;
end;
$$;

select h.username as hub, u.email as signed_in_as, m.role
from public.hub_members m
join public.hubs h on h.id = m.hub_id
join auth.users u on u.id = m.user_id;
