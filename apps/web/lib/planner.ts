import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createUserClient } from "@workspace/lib/supabase/user";
import type { SocialPostStatus, Tables } from "@workspace/lib/supabase/database.types";

export type PlannerPost = Pick<
  Tables<"social_posts">,
  | "id"
  | "kind"
  | "scheduled_at"
  | "caption"
  | "media_urls"
  | "cover_url"
  | "status"
  | "is_affiliate"
  | "is_ai_generated"
  | "promotes"
  | "permalink"
  | "error"
  | "published_at"
>;

const POST_FIELDS =
  "id, kind, scheduled_at, caption, media_urls, cover_url, status, is_affiliate, is_ai_generated, promotes, permalink, error, published_at";

/** The planner's Supabase client: the signed-in user's session, under row-level security. */
async function plannerClient() {
  const store = await cookies();
  return createUserClient({
    getAll: () => store.getAll(),
    setAll(list) {
      // Pages cannot set cookies; the proxy has already refreshed the session.
      // Server actions can, so a refresh during an action is kept.
      try {
        for (const { name, value, options } of list) store.set(name, value, options);
      } catch {}
    },
  });
}

export type Planner = Awaited<ReturnType<typeof requireOwner>>;

/**
 * The signed-in owner and their hub, or a redirect to sign-in. Every planner
 * page and action starts here, so each one checks the session for itself.
 * `hubId` is null when the sign-in works but is not yet linked to a hub.
 */
export async function requireOwner() {
  const db = await plannerClient();
  const { data } = await db.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/planner/sign-in");

  const { data: membership } = await db
    .from("hub_members")
    .select("hub_id")
    .eq("user_id", userId)
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  return { db, userId, email, hubId: membership?.hub_id ?? null };
}

export async function postsBetween(planner: Planner, from: Date, to: Date): Promise<PlannerPost[]> {
  if (!planner.hubId) return [];
  const { data, error } = await planner.db
    .from("social_posts")
    .select(POST_FIELDS)
    .eq("hub_id", planner.hubId)
    .gte("scheduled_at", from.toISOString())
    .lt("scheduled_at", to.toISOString())
    .order("scheduled_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function findPost(planner: Planner, id: string): Promise<PlannerPost | null> {
  if (!planner.hubId || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await planner.db
    .from("social_posts")
    .select(POST_FIELDS)
    .eq("hub_id", planner.hubId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Drafts waiting for review, from now on (any week). */
export async function upcomingDraftCount(planner: Planner, now: Date): Promise<number> {
  if (!planner.hubId) return 0;
  const { count } = await planner.db
    .from("social_posts")
    .select("id", { count: "exact", head: true })
    .eq("hub_id", planner.hubId)
    .eq("status", "draft")
    .gte("scheduled_at", now.toISOString());
  return count ?? 0;
}

/** The review steps a post can take from its current status. */
export const NEXT_STEPS: Record<SocialPostStatus, SocialPostStatus[]> = {
  draft: ["approved", "cancelled"],
  approved: ["draft", "cancelled"],
  failed: ["approved", "cancelled"],
  cancelled: ["draft"],
  publishing: [],
  published: [],
};

export const isEditable = (status: SocialPostStatus) => NEXT_STEPS[status].length > 0;

/** Plain-language versions of what the database refuses. */
export function explainError(error: { code?: string; message: string }): string {
  const { message } = error;
  if (message.includes("social_posts_affiliate_disclosure")) {
    return "Affiliate posts need #ad, (paid link) or #CommissionsEarned in the caption.";
  }
  if (message.includes("social_posts_no_amazon")) {
    return "Amazon links can't go in a caption. They live on imransyednaqvi.com/picks, which the bio links to.";
  }
  if (message.includes("caption")) return "A caption has to be between 1 and 2,200 characters.";
  if (error.code === "P0001") return message;
  if (error.code === "42501") return "This sign-in can't change that post.";
  return `That didn't save: ${message}`;
}
