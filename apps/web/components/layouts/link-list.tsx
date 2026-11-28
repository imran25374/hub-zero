import Link from "next/link";

import { LinkCollection } from "@/components/layouts/link-collection";
import { categoriesOf, groupLinks, type HubSection } from "@/lib/hub";

/**
 * A grouped list of links. Stands in for the Dashboard, Portfolio Mosaic and
 * Classic Stack layouts until they are designed (Stage 3). A link with an
 * image_url shows it as a square picture (Picks uses this); a section with
 * pictures opens as a grid, with a Grid / List switch.
 *
 * A section with two or more groups also gets a category page per group
 * (/picks/beauty), with a row of category links above the items. `category`
 * is the slug of the page being shown; without it, all groups are shown.
 */
export function LinkList({ section, category }: { section: HubSection; category?: string }) {
  const categories = categoriesOf(section);
  const current = category ? categories.find((candidate) => candidate.slug === category) : undefined;
  const groups = current ? [{ label: current.label, links: current.links }] : groupLinks(section.links);

  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-14">
      {categories.length > 0 && <CategoryNav section={section} categories={categories} current={current?.slug} />}
      <LinkCollection
        sectionId={section.id}
        groups={groups}
        showSwitch={section.links.some((link) => link.image_url)}
        hideGroupHeadings={Boolean(current)}
      />
    </main>
  );
}

/** "All · Tech · Home · Beauty …": links to the section page and each category page. */
function CategoryNav({
  section,
  categories,
  current,
}: {
  section: HubSection;
  categories: { label: string; slug: string; links: unknown[] }[];
  current?: string;
}) {
  const chip = (href: string, label: string, active: boolean, count?: number) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] border border-border bg-card px-3.5 text-sm font-semibold no-underline transition-colors hover:bg-secondary aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
      >
        {label}
        {count !== undefined && <span className="font-normal opacity-70">{count}</span>}
      </Link>
    </li>
  );
  return (
    <nav aria-label={`${section.title} categories`} className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {chip(`/${section.slug}`, "All", !current)}
        {categories.map((category) =>
          chip(`/${section.slug}/${category.slug}`, category.label, category.slug === current, category.links.length),
        )}
      </ul>
    </nav>
  );
}
