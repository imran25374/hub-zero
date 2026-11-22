// Pure helpers for describing a click. No imports, so they are easy to test.

export type Device = "mobile" | "tablet" | "desktop" | "other";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type Utm = Record<(typeof UTM_KEYS)[number], string | null>;

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python-requests|headless|lighthouse/i;

/** Crawlers and link previewers are not readers; their visits are not counted. */
export function isBot(userAgent: string): boolean {
  return !userAgent || BOT.test(userAgent);
}

export function deviceFrom(userAgent: string): Device {
  if (/ipad|tablet|kindle|silk|playbook|android(?!.*mobile)/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return "mobile";
  if (/windows|macintosh|mac os x|linux|cros/i.test(userAgent)) return "desktop";
  return "other";
}

/** Two-letter country code from Vercel's x-vercel-ip-country header. */
export function countryFrom(value: string | null): string | null {
  return value && /^[A-Z]{2}$/.test(value) ? value : null;
}

export function clip(value: string | null | undefined, max: number): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

/**
 * UTM tags for a click: those on the /go link itself, otherwise those on the
 * page of this site the click came from (e.g. a visit that arrived from an
 * Instagram post tagged utm_source=instagram).
 */
export function utmFrom(requestUrl: string, referer: string | null): Utm {
  const request = new URL(requestUrl);
  let params = request.searchParams;
  if (!UTM_KEYS.some((key) => params.has(key)) && referer) {
    try {
      const from = new URL(referer);
      if (from.host === request.host) params = from.searchParams;
    } catch {
      // Unparseable referer: no UTM tags.
    }
  }
  return Object.fromEntries(UTM_KEYS.map((key) => [key, clip(params.get(key), 200)])) as Utm;
}

/** The visitor's IP address as reported by Vercel's proxy. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
  );
}
