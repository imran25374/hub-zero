import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@workspace/lib/supabase/client";
import type { Tables } from "@workspace/lib/supabase/database.types";

/** The hub this site renders. LinkHub will route by username; Hub Zero has one. */
export const HUB_USERNAME = "imran";

export type HubLink = Tables<"links">;
export type HubSection = Tables<"sections"> & { links: HubLink[] };
export type Hub = Tables<"hubs"> & { sections: HubSection[] };

const byOrder = (a: { order_index: number }, b: { order_index: number }) =>
  a.order_index - b.order_index;

/**
 * Everything the public site shows, in one query, cached for about a minute.
 * Row-level security already leaves out unpublished hubs, sections and links,
 * so a database edit appears on the site within about a minute, no redeploy.
 *
 * Returns null when Supabase is not configured or not reachable, so a build
 * without credentials still succeeds and pages show a notice instead.
 */
export async function getHub(): Promise<Hub | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("hub");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("hubs")
      .select("*, sections(*, links(*))")
      .eq("username", HUB_USERNAME)
      .maybeSingle();

    if (error) {
      console.error("getHub:", error.message);
      return null;
    }
    if (!data) return null;

    return {
      ...data,
      sections: [...data.sections]
        .sort(byOrder)
        .map((section) => ({ ...section, links: [...section.links].sort(byOrder) })),
    };
  } catch (error) {
    console.error("getHub:", error instanceof Error ? error.message : error);
    return null;
  }
}

export function findSection(hub: Hub | null, slug: string): HubSection | undefined {
  return hub?.sections.find((section) => section.slug === slug);
}

export function findLink(hub: Hub | null, id: string): HubLink | undefined {
  for (const section of hub?.sections ?? []) {
    const link = section.links.find((candidate) => candidate.id === id);
    if (link) return link;
  }
  return undefined;
}

/** Links gathered under their group_label, keeping the database order. */
export function groupLinks(links: HubLink[]): { label: string | null; links: HubLink[] }[] {
  const groups: { label: string | null; links: HubLink[] }[] = [];
  for (const link of links) {
    const last = groups.at(-1);
    if (last && last.label === link.group_label) last.links.push(link);
    else groups.push({ label: link.group_label, links: [link] });
  }
  return groups;
}

/** Splits long-form text into paragraphs on blank lines. */
export function paragraphs(text: string | null): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
