import type { Metadata } from "next";

import { HeroCard } from "@/components/hero-card";
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

  return (
    <main id="content" className="flex flex-1 flex-col">
      <HeroCard hub={hub} />
      <Horizon dawn />
      <SectionTiles hub={hub} />
    </main>
  );
}
