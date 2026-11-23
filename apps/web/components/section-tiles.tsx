import Image from "next/image";
import Link from "next/link";

import { navLabel, type HubSection } from "@/lib/hub";

/**
 * One tile per section given. A section whose links carry images (the books)
 * gets the wide tile and shows them standing side by side; the rest stack
 * beside it.
 */
export function SectionTiles({ sections }: { sections: HubSection[] }) {
  if (sections.length === 0) return null;
  const feature = sections.find((section) => section.links.some((link) => link.image_url));
  const others = sections.filter((section) => section !== feature);

  return (
    <nav aria-label="More sections" className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-20 md:pt-28">
      <div className={feature ? "grid gap-12 md:grid-cols-3" : "grid"}>
        {feature && <FeatureTile section={feature} />}
        {others.length > 0 && (
          <ul className="divide-y divide-border border-y border-border self-start">
            {others.map((section) => (
              <li key={section.id}>
                <Link href={`/${section.slug}`} className="group block py-7">
                  <h2 className="font-serif text-3xl transition-colors group-hover:text-horizon">
                    {navLabel(section)}
                  </h2>
                  {section.description && (
                    <p className="mt-2 text-lg leading-snug text-muted-foreground">{section.description}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}

function FeatureTile({ section }: { section: HubSection }) {
  const covers = section.links.filter((link) => link.image_url).slice(0, 4);
  return (
    <Link href={`/${section.slug}`} className="group block md:col-span-2">
      <div className="flex items-end gap-3 sm:gap-4">
        {covers.map((link) => (
          <div key={link.id} className="flex-1">
            <Image
              src={link.image_url!}
              alt=""
              width={960}
              height={1707}
              sizes="(min-width: 1152px) 170px, (min-width: 768px) 15vw, 23vw"
              className="h-auto w-full rounded-[2px] transition-transform duration-300 group-hover:-translate-y-1"
            />
          </div>
        ))}
      </div>
      <h2 className="mt-7 font-serif text-4xl transition-colors group-hover:text-horizon">
        {navLabel(section)}
      </h2>
      {section.description && (
        <p className="mt-3 max-w-[34em] text-xl leading-snug text-muted-foreground">{section.description}</p>
      )}
    </Link>
  );
}
