import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Supabase client with the secret key. It bypasses row-level security, so it is
 * for server code only; the `server-only` import makes any browser import fail
 * the build. Returns null when the key is not configured, so callers can skip
 * optional work (click recording) instead of crashing.
 */
export function createSecretClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
