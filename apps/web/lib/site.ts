/**
 * The address search engines and link previews should use for this site.
 * Hub Zero lives on one domain; LinkHub will read it from the hub's record.
 * Previews and local builds keep the real address, so a shared preview link
 * still points search engines at the live site.
 */
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://imransyednaqvi.com");
