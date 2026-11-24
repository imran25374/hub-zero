import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // /go/ links are redirects to other sites, not pages.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/go/" }],
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
