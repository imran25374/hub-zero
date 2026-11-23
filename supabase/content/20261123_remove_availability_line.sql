-- Remove the availability line from the /profile header (Imran, 23 Nov 2026).
delete from public.profile_entries
where id = '9e364c27-d878-5b78-8988-8e7f4e156eca'
  and kind = 'header'
  and title = 'Open to senior leadership roles in Pakistan and abroad.';
