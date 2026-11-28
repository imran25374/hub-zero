import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LinkList } from "@/components/layouts/link-list";
import { BandLead, BandTitle, SkyBand } from "@/components/site-header";
import { categoriesOf, findSection, getHub, isUnlisted } from "@/lib/hub";

/**
 * One category of a grouped section: /picks/beauty shows only the Beauty group,
 * with the category links above it. Every published section with two or more
 * groups gets these pages; a category that disappears from the data 404s.
 */
export async function generateStaticParams() {
  const hub = await getHub();
  const params =
    hub?.sections.flatMap((section) =>
      categoriesOf(section).map((category) => ({ slug: section.slug, category: category.slug })),
    ) ?? [];
  // Cache Components needs at least one param at build time; this one renders as not found.
  return params.length > 0 ? params : [{ slug: "about", category: "all" }];
}

async function load(params: Promise<{ slug: string; category: string }>) {
  const { slug, category } = await params;
  const hub = await getHub();
  const section = findSection(hub, slug);
  const current = section ? categoriesOf(section).find((candidate) => candidate.slug === category) : undefined;
  return { hub, section, current, slug, category };
}

export async function generateMetadata({ params }: PageProps<"/[slug]/[category]">): Promise<Metadata> {
  const { hub, section, current, slug, category } = await load(params);
  if (!section || !current) return {};
  const title = `${current.label} | ${section.title}`;
  const description = section.description ?? undefined;
  const image = current.links.find((link) => link.image_url)?.image_url ?? hub?.profile_image_url;
  const url = `/${slug}/${category}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: image ? [image] : [] },
    ...(isUnlisted(section) && { robots: { index: false, follow: true } }),
  };
}

export default async function CategoryPage({ params }: PageProps<"/[slug]/[category]">) {
  const { hub, section, current } = await load(params);
  if (!hub || !section || !current) notFound();

  return (
    <>
      <SkyBand hub={hub} current={section.slug}>
        <BandTitle>
          {section.title}: {current.label}
        </BandTitle>
        {section.description && <BandLead>{section.description}</BandLead>}
      </SkyBand>
      <LinkList section={section} category={current.slug} />
    </>
  );
}
