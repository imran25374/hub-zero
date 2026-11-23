import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@workspace/lib/supabase/client";
import type { ProfileEntryKind, Tables } from "@workspace/lib/supabase/database.types";

/** The hub this site renders. LinkHub will route by username; Hub Zero has one. */
export const HUB_USERNAME = "imran";

export type HubLink = Tables<"links">;
export type ProfileEntry = Tables<"profile_entries">;
export type HubSection = Tables<"sections"> & { links: HubLink[]; profile_entries: ProfileEntry[] };
export type Hub = Tables<"hubs"> & { sections: HubSection[] };

const byOrder = (a: { order_index: number }, b: { order_index: number }) =>
  a.order_index - b.order_index;

/**
 * Everything the public site shows, in one query, cached for about a minute.
 * Row-level security already leaves out unpublished hubs, sections, links and
 * profile entries,
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
      .select("*, sections(*, links(*), profile_entries(*))")
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
        .map((section) => ({
          ...section,
          links: [...section.links].sort(byOrder),
          profile_entries: [...section.profile_entries].sort(byOrder),
        })),
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

/**
 * Where a section's "read more" link should go. A path on this site that
 * names a section only counts while that section is published; otherwise the
 * link falls back to the section's own page (so "Full profile" points to
 * /about until /profile is live).
 */
export function ctaHref(hub: Hub, section: HubSection): string {
  const href = section.cta_href;
  if (!href) return `/${section.slug}`;
  if (!href.startsWith("/")) return href;
  const slug = href.slice(1).split(/[/?#]/)[0];
  if (slug === "" || hub.sections.some((candidate) => candidate.slug === slug)) return href;
  return `/${section.slug}`;
}

/** Top-level entries of one kind, in order. Nested entries come from childrenOf. */
export function entriesOf(section: HubSection, kind: ProfileEntryKind): ProfileEntry[] {
  return section.profile_entries.filter((entry) => entry.kind === kind && !entry.parent_id);
}

/** Entries nested under another, such as appointments within an army career. */
export function childrenOf(section: HubSection, parent: ProfileEntry): ProfileEntry[] {
  return section.profile_entries.filter((entry) => entry.parent_id === parent.id);
}

/** The short name used in menus and tiles. */
export function navLabel(section: HubSection): string {
  return section.nav_label ?? section.title;
}

export type TextBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "heading"; text: string };

/**
 * Reads an entry's plain-text body: blank lines separate paragraphs, lines
 * starting "- " are bullets, and a line starting "### " is a sub-heading.
 */
export function textBlocks(text: string | null): TextBlock[] {
  const blocks: TextBlock[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  for (const raw of (text ?? "").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith("### ")) {
      flush();
      blocks.push({ type: "heading", text: line.slice(4).trim() });
    } else if (line.startsWith("- ")) {
      flush();
      const last = blocks.at(-1);
      if (last?.type === "list") last.items.push(line.slice(2).trim());
      else blocks.push({ type: "list", items: [line.slice(2).trim()] });
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A date column (yyyy-mm-dd) shown at the entry's precision: 2024, Dec 2024 or 3 Dec 2024. */
export function formatDate(date: string, precision: ProfileEntry["date_precision"]): string {
  const [year, month, day] = date.split("-").map(Number);
  if (precision === "year") return String(year);
  if (precision === "month") return `${MONTHS[month - 1]} ${year}`;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** An entry's period as text, e.g. "2017 – 2019", "Jul 2026 – present" or "2024". */
export function formatPeriod(entry: ProfileEntry): string | null {
  const start = entry.start_date && formatDate(entry.start_date, entry.date_precision);
  const end = entry.is_current
    ? "present"
    : entry.end_date && formatDate(entry.end_date, entry.date_precision);
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start || end || null;
}
