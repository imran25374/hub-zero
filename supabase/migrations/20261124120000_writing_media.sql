-- Hub Zero schema v5: media on profile entries, for the writing page.
--
-- A publication can now carry the media it was published with: a header
-- image at its own size (so the page can reserve the right shape before it
-- loads), a video that plays on the page with its poster in image_url, or a
-- set of further images (the panels of a carousel post, a figure from a
-- thesis). Grants and row-level security on profile_entries are unchanged.

alter table public.profile_entries
  add column image_width  integer check (image_width between 1 and 10000),
  add column image_height integer check (image_height between 1 and 10000),
  add column video_url    text check (video_url ~ '^https://' and char_length(video_url) <= 2048),
  add column duration_seconds integer check (duration_seconds between 1 and 86400),
  add column gallery_urls text[] check (
    gallery_urls is null
    or (array_length(gallery_urls, 1) between 1 and 40
        and array_to_string(gallery_urls, ' ') !~ '(^| )(?!https://)')
  ),
  add constraint profile_entries_image_size_pair check ((image_width is null) = (image_height is null));

comment on column public.profile_entries.image_width is 'Pixel width of image_url, so the page can reserve its shape; set with image_height.';
comment on column public.profile_entries.image_height is 'Pixel height of image_url; set with image_width.';
comment on column public.profile_entries.video_url is 'An MP4 that plays on the page (H.264, faststart), with image_url as its poster.';
comment on column public.profile_entries.duration_seconds is 'Length of video_url, shown as m:ss.';
comment on column public.profile_entries.gallery_urls is 'Further images in order: the panels of a carousel post, or figures from a document. All https.';
