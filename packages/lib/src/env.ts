/**
 * Public configuration read from environment variables.
 *
 * Names match .env.example at the repo root. Each variable is referenced in full
 * (process.env.NEXT_PUBLIC_...) so Next.js can inline it into browser code.
 * Server-only secrets (SUPABASE_SECRET_KEY) are deliberately not exported here.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  posthogProjectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
} as const;

export type PublicEnv = typeof publicEnv;
