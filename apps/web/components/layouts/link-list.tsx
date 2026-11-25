import { LinkCollection } from "@/components/layouts/link-collection";
import { groupLinks, type HubSection } from "@/lib/hub";

/**
 * A grouped list of links. Stands in for the Dashboard, Portfolio Mosaic and
 * Classic Stack layouts until they are designed (Stage 3). A link with an
 * image_url shows it as a square picture (Picks uses this); a section with
 * pictures also gets a List / Grid switch, opening as a list.
 */
export function LinkList({ section }: { section: HubSection }) {
  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-14">
      <LinkCollection
        sectionId={section.id}
        groups={groupLinks(section.links)}
        showSwitch={section.links.some((link) => link.image_url)}
      />
    </main>
  );
}
