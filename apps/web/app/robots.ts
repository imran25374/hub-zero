import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // /go/ links are redirects to other sites, not pages; /planner is private.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/go/", "/planner"] }],
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
