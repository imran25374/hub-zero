-- MONUSCO appointment (Imran, 23 Nov 2026): the primary designation was
-- Financial Advisor and Accounts Officer; liaison officer was an additional
-- duty that became the larger part of the role.
update public.profile_entries
set title = $t$Financial Advisor and Accounts Officer, and Liaison Officer, UN Peacekeeping (MONUSCO)$t$,
    body = $t$Appointed Financial Advisor and Accounts Officer, with liaison officer as an additional duty that grew to become the larger part of the role: working daily with contingents from 21 other countries in a multinational peacekeeping mission. Awarded the United Nations Medal.$t$
where id = 'c10c9236-8bb1-5867-ae50-6f87d84d1862' and kind = 'experience';
