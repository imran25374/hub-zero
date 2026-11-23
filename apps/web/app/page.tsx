import type { Metadata } from "next";

import { HeroCard } from "@/components/hero-card";
import { HomeSection, rendersInline } from "@/components/home/home-sections";
import { Horizon } from "@/components/horizon";
import { Notice } from "@/components/notice";
import { SectionTiles } from "@/components/section-tiles";
import { getHub } from "@/lib/hub";

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getHub();
  return {
    title: { absolute: hub?.display_name ?? "Imran Naqvi" },
    description: hub?.identity_statement ?? undefined,
  };
}

export default async function HomePage() {
  const hub = await getHub();
  if (!hub) {
    return <Notice title="Content is unavailable right now.">Try again in a minute.</Notice>;
  }

  // The long scroll: hero, then the sections shown in full (in their order),
  // then a tile for each remaining section. "hidden" sections are left out.
  const inline = hub.sections.filter(rendersInline);
  const tiles = hub.sections.filter((section) => section.home_display !== "hidden" && !rendersInline(section));

  return (
    <main id="content" className="flex flex-1 flex-col overflow-x-clip pb-20 md:pb-28">
      <HeroCard hub={hub} />
      <Horizon dawn />
      {inline.map((section) => (
        <HomeSection key={section.id} hub={hub} section={section} />
      ))}
      <SectionTiles sections={tiles} />
    </main>
  );
}
