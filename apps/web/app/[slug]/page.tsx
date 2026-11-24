import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HeroSplit } from "@/components/layouts/hero-split";
import { LinkList } from "@/components/layouts/link-list";
import { MagazineGrid } from "@/components/layouts/magazine-grid";
import { PortfolioMosaic } from "@/components/layouts/portfolio-mosaic";
import { ProfileBand } from "@/components/profile/profile-record";
import { BandLead, BandTitle, SkyBand } from "@/components/site-header";
import { findSection, getHub, isProfilePage, type Hub, type HubSection } from "@/lib/hub";

// Published sections are prerendered. A section published later renders on its
// first visit. Cache Components needs at least one param at build time, so a
// build without database access still lists "about" (it renders as not found).
export async function generateStaticParams() {
  const hub = await getHub();
  const slugs = hub?.sections.map((section) => ({ slug: section.slug })) ?? [];
  return slugs.length > 0 ? slugs : [{ slug: "about" }];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const section = findSection(await getHub(), slug);
  if (!section) return {};
  // A section with its own menu label (a profile titled with a full name) reads "Title | Label".
  const title = section.nav_label ? { absolute: `${section.title} | ${section.nav_label}` } : section.title;
  return { title, description: section.description ?? undefined };
}

export default async function SectionPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const hub = await getHub();
  const section = findSection(hub, slug);
  if (!hub || !section) notFound();

  const isProfile = isProfilePage(section);
  return (
    <>
      <SkyBand hub={hub} current={section.slug} portrait={isProfile}>
        <BandTitle>{section.title}</BandTitle>
        {isProfile ? (
          <ProfileBand section={section} />
        ) : (
          section.description && <BandLead>{section.description}</BandLead>
        )}
      </SkyBand>
      <SectionLayout hub={hub} section={section} />
    </>
  );
}

function SectionLayout({ hub, section }: { hub: Hub; section: HubSection }) {
  switch (section.layout_id) {
    case "hero-split":
      return <HeroSplit hub={hub} section={section} />;
    case "magazine-grid":
      return <MagazineGrid section={section} />;
    case "portfolio-mosaic":
      return <PortfolioMosaic section={section} />;
    default:
      // dashboard, classic-stack: designed in Stage 3.
      return <LinkList section={section} />;
  }
}
