import "server-only";

import { createSecretClient } from "@workspace/lib/supabase/server";
import type { Tables } from "@workspace/lib/supabase/database.types";

import {
  containerStatus,
  createContainer,
  InstagramError,
  isFacebookToken,
  mediaPermalink,
  publishContainer,
  refreshToken,
} from "@/lib/instagram";

type Post = Tables<"social_posts">;
type Client = NonNullable<ReturnType<typeof createSecretClient>>;

const MAX_ATTEMPTS = 6;
const BATCH = 5;
const DAY = 24 * 60 * 60 * 1000;

export type PublishReport = {
  ran: boolean;
  reason?: string;
  token?: "seeded" | "refreshed" | "ok";
  posts: { id: string; outcome: string }[];
};

/**
 * One pass of the publisher, run by the site's cron every few minutes:
 * keeps the Instagram token alive, then takes the approved posts whose time
 * has come and moves each one step forward. Images usually go straight to
 * published; a reel gets its container in one pass and is published in a
 * later one, once Instagram has processed the video.
 */
export async function runPublisher(now = new Date()): Promise<PublishReport> {
  const db = createSecretClient();
  if (!db) return { ran: false, reason: "Supabase secret key not configured", posts: [] };

  const credentials = await loadCredentials(db, now);
  if (!credentials) return { ran: false, reason: "No Instagram token: set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID", posts: [] };

  const { data: due, error } = await db
    .from("social_posts")
    .select("*")
    .eq("channel", "instagram")
    .in("status", ["approved", "publishing"])
    .lte("scheduled_at", now.toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(BATCH);
  if (error) return { ran: false, reason: error.message, posts: [] };

  const report: PublishReport = { ran: true, token: credentials.state, posts: [] };
  for (const post of due ?? []) {
    const outcome = await advance(db, post, credentials, now);
    report.posts.push({ id: post.id, outcome });
  }
  return report;
}

type Credentials = { accountId: string; token: string; state: "seeded" | "refreshed" | "ok" };

/**
 * The long-lived token lives in integration_tokens so the job can refresh it
 * (every token dies after 60 days without a refresh). The first run seeds the
 * table from the environment; after that the environment value is ignored.
 */
async function loadCredentials(db: Client, now: Date): Promise<Credentials | null> {
  const { data: stored } = await db.from("integration_tokens").select("*").eq("provider", "instagram").maybeSingle();

  if (!stored) {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    if (!token || !accountId) return null;
    // A token from the App Dashboard is valid for 60 days; assume it is fresh.
    const expiresAt = new Date(now.getTime() + 59 * DAY).toISOString();
    await db.from("integration_tokens").insert({ provider: "instagram", account_id: accountId, token, expires_at: expiresAt });
    return { accountId, token, state: "seeded" };
  }

  const expiresIn = new Date(stored.expires_at).getTime() - now.getTime();
  const age = now.getTime() - new Date(stored.updated_at).getTime();
  // Only Instagram tokens refresh this way; Facebook-type tokens from the dashboard do not expire.
  if (!isFacebookToken(stored.token) && expiresIn < 14 * DAY && age > DAY) {
    try {
      const fresh = await refreshToken(stored.token);
      await db
        .from("integration_tokens")
        .update({ token: fresh.token, expires_at: new Date(now.getTime() + fresh.expiresInSeconds * 1000).toISOString() })
        .eq("provider", "instagram");
      return { accountId: stored.account_id, token: fresh.token, state: "refreshed" };
    } catch (error) {
      console.error("Instagram token refresh failed:", error instanceof Error ? error.message : error);
    }
  }
  return { accountId: stored.account_id, token: stored.token, state: "ok" };
}

/** Moves one post a step: approved → container; publishing → published when ready. */
async function advance(db: Client, post: Post, credentials: Credentials, now: Date): Promise<string> {
  const { accountId, token } = credentials;
  const fail = async (message: string) => {
    await db.from("social_posts").update({ status: "failed", error: message.slice(0, 1000) }).eq("id", post.id);
    return `failed: ${message}`;
  };

  if (post.attempts >= MAX_ATTEMPTS) return fail(`Gave up after ${post.attempts} attempts${post.error ? `: ${post.error}` : ""}`);

  try {
    let containerId = post.container_id;

    if (post.status === "approved" || !containerId) {
      containerId = await createContainers(accountId, token, post);
      await db
        .from("social_posts")
        .update({ status: "publishing", container_id: containerId, attempts: post.attempts + 1, error: null })
        .eq("id", post.id);
    }

    const { status, detail } = await containerStatus(containerId, token);
    if (status === "IN_PROGRESS") return "processing";
    if (status === "ERROR" || status === "EXPIRED") {
      // A fresh container next time, up to the attempt limit.
      await db
        .from("social_posts")
        .update({ container_id: null, attempts: post.attempts + 1, error: `${status}: ${detail}` })
        .eq("id", post.id);
      return `container ${status.toLowerCase()}: ${detail}`;
    }

    const mediaId = await publishContainer(accountId, token, containerId);
    const permalink = await mediaPermalink(mediaId, token).catch(() => null);
    await db
      .from("social_posts")
      .update({ status: "published", external_id: mediaId, permalink, published_at: now.toISOString(), error: null })
      .eq("id", post.id);
    return `published ${permalink ?? mediaId}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Instagram's own rejections (bad media, rate limit) are worth another try later;
    // record the message and count the attempt.
    await db
      .from("social_posts")
      .update({ attempts: post.attempts + 1, error: message.slice(0, 1000), container_id: error instanceof InstagramError ? null : post.container_id })
      .eq("id", post.id);
    return `error: ${message}`;
  }
}

/** Creates the container(s) for a post and returns the id to publish. */
async function createContainers(accountId: string, token: string, post: Post): Promise<string> {
  const options = { aiGenerated: post.is_ai_generated };
  const [first] = post.media_urls;
  if (!first) throw new Error("No media");

  switch (post.kind) {
    case "image":
      return createContainer(accountId, token, { kind: "image", image_url: first, caption: post.caption }, options);
    case "reel":
      return createContainer(
        accountId,
        token,
        { kind: "reel", video_url: first, caption: post.caption, cover_url: post.cover_url ?? undefined, share_to_feed: post.share_to_feed },
        options,
      );
    case "story":
      return createContainer(
        accountId,
        token,
        isVideo(first) ? { kind: "story", video_url: first } : { kind: "story", image_url: first },
        options,
      );
    case "carousel": {
      const children: string[] = [];
      for (const url of post.media_urls) {
        children.push(
          await createContainer(
            accountId,
            token,
            isVideo(url) ? { kind: "video", video_url: url, is_carousel_item: true } : { kind: "image", image_url: url, is_carousel_item: true },
            // No AI label on the items: Instagram accepts it only on the carousel container
            // (it refused the 26 Nov carousel six times for this).
          ),
        );
      }
      return createContainer(accountId, token, { kind: "carousel", children, caption: post.caption }, options);
    }
  }
}

const isVideo = (url: string) => /\.(mp4|mov)(\?|$)/i.test(url);
