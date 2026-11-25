"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { createUserClient } from "@workspace/lib/supabase/user";
import type { SocialPostStatus } from "@workspace/lib/supabase/database.types";

import { explainError, NEXT_STEPS, requireOwner } from "@/lib/planner";
import { fromLocalInput } from "@/lib/planner-time";

export type ActionState = { error?: string; done?: string };

async function sessionClient() {
  const store = await cookies();
  return createUserClient({
    getAll: () => store.getAll(),
    setAll(list) {
      for (const { name, value, options } of list) store.set(name, value, options);
    },
  });
}

export async function signIn(_: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const db = await sessionClient();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error: error.code === "invalid_credentials" ? "That email and password don't match." : `Sign-in failed: ${error.message}`,
    };
  }
  redirect("/planner");
}

export async function signOut(): Promise<void> {
  const db = await sessionClient();
  await db.auth.signOut();
  redirect("/planner/sign-in");
}

const STEP_DONE: Partial<Record<SocialPostStatus, string>> = {
  approved: "Approved. It goes out at its time.",
  draft: "Back in drafts.",
  cancelled: "Cancelled. It won't go out.",
};

/** Approve, back to draft, cancel, retry, restore: one step from the current status. */
export async function reviewPost(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("id") ?? "");
  const to = String(form.get("to") ?? "") as SocialPostStatus;
  const planner = await requireOwner();
  if (!planner.hubId) return { error: "This sign-in isn't linked to Hub Zero yet." };

  const { data: post } = await planner.db.from("social_posts").select("status").eq("id", id).maybeSingle();
  if (!post) return { error: "That post isn't in your planner." };
  if (!NEXT_STEPS[post.status].includes(to)) return { error: `A ${post.status} post can't be moved to ${to}.` };

  const { error } = await planner.db.from("social_posts").update({ status: to }).eq("id", id);
  if (error) return { error: explainError(error) };
  refresh();
  return { done: STEP_DONE[to] };
}

/** Saves an edited caption and time (Pakistan time). */
export async function savePost(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("id") ?? "");
  const caption = String(form.get("caption") ?? "").replace(/\r\n/g, "\n").trim();
  const when = fromLocalInput(String(form.get("when") ?? ""));
  if (!caption) return { error: "The caption can't be empty." };
  if (!when) return { error: "Pick a date and time." };

  const planner = await requireOwner();
  if (!planner.hubId) return { error: "This sign-in isn't linked to Hub Zero yet." };

  const { data, error } = await planner.db
    .from("social_posts")
    .update({ caption, scheduled_at: when.toISOString() })
    .eq("id", id)
    .select("id");
  if (error) return { error: explainError(error) };
  if (!data?.length) return { error: "That post isn't in your planner." };
  refresh();
  return { done: "Saved." };
}

/** Approves every draft scheduled in one week. */
export async function approveWeek(_: ActionState, form: FormData): Promise<ActionState> {
  const from = new Date(String(form.get("from") ?? ""));
  const to = new Date(String(form.get("to") ?? ""));
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return { error: "That week isn't valid." };

  const planner = await requireOwner();
  if (!planner.hubId) return { error: "This sign-in isn't linked to Hub Zero yet." };

  const { data, error } = await planner.db
    .from("social_posts")
    .update({ status: "approved" })
    .eq("hub_id", planner.hubId)
    .eq("status", "draft")
    .gte("scheduled_at", from.toISOString())
    .lt("scheduled_at", to.toISOString())
    .select("id");
  if (error) return { error: explainError(error) };
  refresh();
  const n = data?.length ?? 0;
  return { done: n === 1 ? "Approved 1 post." : `Approved ${n} posts.` };
}
