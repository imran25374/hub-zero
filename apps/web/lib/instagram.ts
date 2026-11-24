import "server-only";

/**
 * The slice of Instagram's Content Publishing API the publisher uses
 * (Instagram API with Instagram Login: graph.instagram.com, Instagram User
 * access tokens). Publishing is two steps: create a media container from a
 * public URL, then publish it once Instagram has processed it.
 */

const VERSION = "v26.0";

/**
 * Tokens from Business Login for Instagram (IGAA…) use graph.instagram.com;
 * Facebook-type tokens (EAA…, from Facebook Login for Business or a system
 * user) use graph.facebook.com. Meta's newer "Unified login" apps can issue
 * either, so the host follows the token.
 */
export const isFacebookToken = (token: string) => token.startsWith("EAA");
const hostFor = (token: string) => (isFacebookToken(token) ? "https://graph.facebook.com" : "https://graph.instagram.com");

export class InstagramError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly subcode?: number,
  ) {
    super(message);
    this.name = "InstagramError";
  }
}

type Params = Record<string, string | number | boolean | string[] | undefined>;

async function call<T>(method: "GET" | "POST", path: string, params: Params, token: string): Promise<T> {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    body.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  body.set("access_token", token);

  // Versioned paths start with "/"; the token endpoint is unversioned and given without one.
  const base = path.startsWith("/") ? `${hostFor(token)}/${VERSION}${path}` : `${hostFor(token)}/${path}`;
  const url = method === "GET" ? `${base}?${body}` : base;
  const response = await fetch(url, {
    method,
    headers: method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : undefined,
    body: method === "POST" ? body : undefined,
    cache: "no-store",
  });

  const json = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string; code?: number; error_subcode?: number; error_user_msg?: string };
  };
  if (!response.ok || json.error) {
    const error = json.error ?? {};
    throw new InstagramError(
      error.error_user_msg ?? error.message ?? `Instagram answered ${response.status}`,
      error.code,
      error.error_subcode,
    );
  }
  return json;
}

export type ContainerInput =
  | { kind: "image"; image_url: string; caption?: string; is_carousel_item?: boolean }
  | { kind: "video"; video_url: string; is_carousel_item: true }
  | { kind: "reel"; video_url: string; caption?: string; cover_url?: string; share_to_feed?: boolean }
  | { kind: "story"; image_url?: string; video_url?: string }
  | { kind: "carousel"; children: string[]; caption?: string };

/** Creates a media container and returns its id. */
export async function createContainer(
  accountId: string,
  token: string,
  input: ContainerInput,
  options: { aiGenerated?: boolean } = {},
): Promise<string> {
  const params: Params = { is_ai_generated: options.aiGenerated ? true : undefined };
  switch (input.kind) {
    case "image":
      Object.assign(params, { image_url: input.image_url, caption: input.caption, is_carousel_item: input.is_carousel_item });
      break;
    case "video":
      Object.assign(params, { media_type: "VIDEO", video_url: input.video_url, is_carousel_item: true });
      break;
    case "reel":
      Object.assign(params, {
        media_type: "REELS",
        video_url: input.video_url,
        caption: input.caption,
        cover_url: input.cover_url,
        share_to_feed: input.share_to_feed,
      });
      break;
    case "story":
      Object.assign(params, { media_type: "STORIES", image_url: input.image_url, video_url: input.video_url });
      break;
    case "carousel":
      Object.assign(params, { media_type: "CAROUSEL", children: input.children, caption: input.caption });
      break;
  }
  const { id } = await call<{ id: string }>("POST", `/${accountId}/media`, params, token);
  return id;
}

export type ContainerStatus = "EXPIRED" | "ERROR" | "FINISHED" | "IN_PROGRESS" | "PUBLISHED";

/** Whether Instagram has finished processing a container (videos take a while). */
export async function containerStatus(
  containerId: string,
  token: string,
): Promise<{ status: ContainerStatus; detail: string }> {
  const result = await call<{ status_code: ContainerStatus; status?: string }>(
    "GET",
    `/${containerId}`,
    { fields: "status_code,status" },
    token,
  );
  return { status: result.status_code, detail: result.status ?? "" };
}

/** Publishes a finished container; returns the Instagram media id. */
export async function publishContainer(accountId: string, token: string, containerId: string): Promise<string> {
  const { id } = await call<{ id: string }>("POST", `/${accountId}/media_publish`, { creation_id: containerId }, token);
  return id;
}

/** The public link of a published post. */
export async function mediaPermalink(mediaId: string, token: string): Promise<string | null> {
  const result = await call<{ permalink?: string }>("GET", `/${mediaId}`, { fields: "permalink" }, token);
  return result.permalink ?? null;
}

/** Extends a long-lived Instagram token for another 60 days (allowed once it is a day old). */
export async function refreshToken(token: string): Promise<{ token: string; expiresInSeconds: number }> {
  const result = await call<{ access_token: string; expires_in: number }>(
    "GET",
    "refresh_access_token",
    { grant_type: "ig_refresh_token" },
    token,
  );
  return { token: result.access_token, expiresInSeconds: result.expires_in };
}

/** How many API posts the account has made in the current 24-hour window (limit 100). */
export async function publishingQuota(accountId: string, token: string): Promise<number | null> {
  const result = await call<{ data?: { quota_usage?: number }[] }>(
    "GET",
    `/${accountId}/content_publishing_limit`,
    { fields: "quota_usage" },
    token,
  );
  return result.data?.[0]?.quota_usage ?? null;
}
