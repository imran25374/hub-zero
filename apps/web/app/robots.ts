import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // /go/ links are redirects to other sites, not pages.
  return { rules: [{ userAgent: "*", allow: "/", disallow: "/go/" }] };
}
