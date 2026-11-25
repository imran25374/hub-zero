import "server-only";

import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { publicEnv } from "../env";
import type { Database } from "./database.types";

/**
 * Supabase client for a signed-in user (the planner). Uses the publishable
 * key plus the user's session from cookies, so row-level security decides
 * what it sees: a hub owner reads and reviews that hub's social posts, nothing
 * more. Create one per request; never share it.
 *
 * `cookies.getAll` reads the request's cookies; `cookies.setAll` writes a
 * refreshed session back. Pages cannot set cookies, so the site's proxy
 * refreshes the session before a planner page renders.
 */
export function createUserClient(cookies: CookieMethodsServer): SupabaseClient<Database> {
  const { supabaseUrl, supabasePublishableKey } = publicEnv;
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, { cookies });
}
