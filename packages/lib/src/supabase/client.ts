import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { publicEnv } from "../env";
import type { Database } from "./database.types";

export type HubZeroClient = SupabaseClient<Database>;

/**
 * Supabase client for the public site.
 *
 * Uses the publishable key, so row-level security decides what it can do:
 * read published hubs, sections and links, and record link clicks. Safe in
 * server components and in the browser. No user sessions until Stage 4.
 *
 * Record clicks with `.insert(...)` and no `.select()`: click rows are
 * write-only for the public, so asking for the row back is refused.
 */
export function createPublicClient(): HubZeroClient {
  const { supabaseUrl, supabasePublishableKey } = publicEnv;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in apps/web/.env.local (see .env.example).",
    );
  }

  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
