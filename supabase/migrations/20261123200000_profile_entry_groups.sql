-- Hub Zero schema v4: group headings for profile entries.
--
-- Lets a profile split one kind of entry into groups under small headings,
-- e.g. publications into "Professional", "Books", "The Redacted Series notes"
-- and "Video essays". Entries with the same label are shown together, in order.
-- Grants and row-level security on profile_entries are unchanged.

alter table public.profile_entries
  add column group_label text check (char_length(group_label) between 1 and 80);

comment on column public.profile_entries.group_label is
  'Optional heading that groups entries of one kind; entries sharing a label are shown together, in order.';
