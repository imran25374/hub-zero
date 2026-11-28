import type { MetadataRoute } from "next";

import { categoriesOf, getHub, isUnlisted } from "@/lib/hub";
import { SITE_URL } from "@/lib/site";

/**
 * The home page, every published, listed section and its category pages;
 * unpublished ones are not in getHub(), unlisted ones are left out.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hub = await getHub();
  const home = { url: SITE_URL.href, lastModified: hub ? new Date(hub.updated_at) : undefined, priority: 1 };
  const sections = (hub?.sections ?? [])
    .filter((section) => !isUnlisted(section))
    .flatMap((section) => [
      { url: new URL(`/${section.slug}`, SITE_URL).href, lastModified: new Date(section.updated_at), priority: 0.8 },
      ...categoriesOf(section).map((category) => ({
        url: new URL(`/${section.slug}/${category.slug}`, SITE_URL).href,
        lastModified: new Date(section.updated_at),
        priority: 0.6,
      })),
    ]);
  return [home, ...sections];
}
