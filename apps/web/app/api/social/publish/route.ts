import type { NextRequest } from "next/server";

import { runPublisher } from "@/lib/social-publisher";

export const maxDuration = 60;

/**
 * Publishes the approved social posts that are due. Vercel's cron calls it
 * every 15 minutes with the CRON_SECRET; anyone else gets 401. Nothing here
 * is cached: the queue is read fresh on every call.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await runPublisher();
  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}
