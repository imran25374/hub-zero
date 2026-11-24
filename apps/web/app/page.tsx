import type { Metadata } from "next";

import { HomeSection, rendersInline } from "@/components/home/home-sections";
import { Notice } from "@/components/notice";
import { SectionTiles } from "@/components/section-tiles";
import { BandLead, BandTitle, SkyBand } from "@/components/site-header";
import { getHub, isProfilePage } from "@/lib/hub";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getHub();
  const title = hub?.display_name ?? "Imran Naqvi";
  const description = hub?.identity_statement ?? undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/", images: hub?.profile_image_url ? [hub.profile_image_url] : [] },
  };
}

export default async function HomePage() {
  const hub = await getHub();
  if (!hub) {
    return <Notice title="Content is unavailable right now.">Try again in a minute.</Notice>;
  }

  // The long scroll: the sky with the identity, then the sections shown in full
  // (in their order), then a tile for each remaining section, then contact.
  const inline = hub.sections.filter(rendersInline);
  const tiles = hub.sections.filter((section) => section.home_display !== "hidden" && !rendersInline(section));
  const fullName = hub.sections.find(isProfilePage)?.title ?? hub.display_name;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    alternateName: hub.display_name,
    url: SITE_URL.href,
    image: hub.profile_image_url ?? undefined,
    description: hub.identity_statement ?? undefined,
    sameAs: hub.social_links.map((link) => link.url),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <SkyBand hub={hub} photo={hub.cover_image_url} portrait>
        <BandTitle>{fullName}</BandTitle>
        {hub.identity_statement && <BandLead className="sm:text-xl">{hub.identity_statement}</BandLead>}
        {hub.social_links.length > 0 && (
          <ul className="on-sky-text mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-on-sky">
            {hub.social_links.map((profile) => (
              <li key={profile.url}>
                <a href={profile.url} target="_blank" rel="me noopener" className="underline-offset-4 hover:underline">
                  {profile.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="underline-offset-4 hover:underline">
                info@imransyednaqvi.com
              </a>
            </li>
          </ul>
        )}
      </SkyBand>
      <main id="content" className="flex flex-1 flex-col pb-20 md:pb-24">
        {inline.map((section) => (
          <HomeSection key={section.id} hub={hub} section={section} />
        ))}
        <SectionTiles sections={tiles} />
        <Contact linkedin={hub.social_links.find((profile) => /linkedin\.com/.test(profile.url))?.url} />
      </main>
    </>
  );
}

/** Fixed in code: the contact block closes the home page whatever the content holds. */
function Contact({ linkedin }: { linkedin?: string }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto mt-20 grid w-full max-w-6xl gap-x-8 gap-y-4 border-t border-border px-6 pt-10 md:mt-24 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
    >
      <h2 id="contact-heading" className="font-serif text-[1.75rem] leading-tight sm:text-[2.125rem]">
        Contact
      </h2>
      <div className="text-[1.0625rem] leading-relaxed">
        <p>
          For speaking, consulting and press:{" "}
          <a href="mailto:info@imransyednaqvi.com" className="text-horizon underline-offset-4 hover:underline">
            info@imransyednaqvi.com
          </a>
          {linkedin && (
            <>
              , or a message on{" "}
              <a href={linkedin} target="_blank" rel="me noopener" className="text-horizon underline-offset-4 hover:underline">
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          )}
          .
        </p>
      </div>
    </section>
  );
}
