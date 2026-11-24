-- First Instagram post through the queue: an intro story on @studiotools.marketing
-- (24 Nov 2026). Running this approves it; the publisher posts it within 15 minutes.
-- Stories take no caption through the API; the caption here is an internal note.
-- Safe to run twice.

insert into public.social_posts
  (id, hub_id, channel, kind, scheduled_at, caption, media_urls, promotes, status)
values (
  'a1f0c3d2-4b5e-4f6a-9c7d-8e9f0a1b2c3d', '0c24743e-90f5-4183-8484-46bc12f2e019', 'instagram', 'story', now(),
  $t$Intro story: AI tools, tested in real businesses. Not reviewed. Deployed. (Pipeline test.)$t$,
  array['https://jrjqtdjlchiyxoluixlv.supabase.co/storage/v1/object/public/hub-media/imran/social/story-intro.jpg'],
  'account intro', 'approved'
)
on conflict (id) do nothing;
