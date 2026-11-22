import "server-only";

import { createHmac } from "node:crypto";

import { createSecretClient } from "@workspace/lib/supabase/server";

import { clip, countryFrom, deviceFrom, isBot, utmFrom } from "./click-context";

export type Click = {
  linkId: string;
  ip: string;
  userAgent: string;
  referer: string | null;
  country: string | null;
  requestUrl: string;
};

/**
 * Records one click through record_click(), which enforces the rate limit
 * (10 clicks a minute per visitor) and ignores links the public can't see.
 *
 * The visitor is identified only by a keyed hash of IP address, browser and
 * date, used for rate limiting and kept for at most an hour; no IP address is
 * stored. Never throws: a failure to record must not break the redirect.
 */
export async function recordClick(click: Click): Promise<void> {
  try {
    if (isBot(click.userAgent)) return;

    const supabase = createSecretClient();
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!supabase || !key) return; // Click recording not configured.

    const day = new Date().toISOString().slice(0, 10);
    const visitorHash = createHmac("sha256", key)
      .update(`${click.ip}|${click.userAgent}|${day}`)
      .digest("hex")
      .slice(0, 32);
    const utm = utmFrom(click.requestUrl, click.referer);

    const { error } = await supabase.rpc("record_click", {
      p_link_id: click.linkId,
      p_visitor_hash: visitorHash,
      p_referrer: clip(click.referer, 2048),
      p_country: countryFrom(click.country),
      p_device: deviceFrom(click.userAgent),
      p_utm_source: utm.utm_source,
      p_utm_medium: utm.utm_medium,
      p_utm_campaign: utm.utm_campaign,
      p_utm_term: utm.utm_term,
      p_utm_content: utm.utm_content,
    });
    if (error) console.error("record_click:", error.message);
  } catch (error) {
    console.error("record_click:", error instanceof Error ? error.message : error);
  }
}
