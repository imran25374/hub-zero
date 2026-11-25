import Image from "next/image";

import { LinkAction } from "@/components/link-action";
import { groupLinks, type HubLink, type HubSection } from "@/lib/hub";

/** Tag on a link whose image is AI-generated; the page then says so under the picture. */
export const AI_IMAGE_TAG = "ai-image";

/**
 * A plain grouped list of links. Stands in for the Dashboard, Portfolio Mosaic
 * and Classic Stack layouts until they are designed (Stage 3). A link with an
 * image_url shows it as a square picture on the left (Picks uses this).
 */
export function LinkList({ section }: { section: HubSection }) {
  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-14">
      {groupLinks(section.links).map((group, index) => (
        <section key={group.label ?? index} className={index === 0 ? "" : "mt-14"}>
          {group.label && <h2 className="font-serif text-[1.75rem]">{group.label}</h2>}
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {group.links.map((link) => (
              <li
                key={link.id}
                className={`grid gap-4 py-6 md:items-center ${
                  link.image_url
                    ? "grid-cols-[96px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[140px_minmax(0,1fr)] md:grid-cols-[160px_minmax(0,2fr)_auto] md:gap-x-8"
                    : "md:grid-cols-[minmax(0,2fr)_auto]"
                }`}
              >
                {link.image_url && <LinkPicture link={link} />}
                <div>
                  <h3 className="font-serif text-[1.375rem]">{link.title}</h3>
                  {link.subtitle && <p className="mt-1 text-muted-foreground italic">{link.subtitle}</p>}
                  {link.description && <p className="mt-2 max-w-[38em] text-lg">{link.description}</p>}
                </div>
                <div className={link.image_url ? "col-span-2 md:col-span-1" : ""}>
                  <LinkAction link={link} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

/** The link's picture, square, on white so product shots sit cleanly; a small note when it is AI-generated. */
function LinkPicture({ link }: { link: HubLink }) {
  const isAi = link.tags.includes(AI_IMAGE_TAG);
  return (
    <figure className="self-start">
      <div className="relative aspect-square overflow-hidden rounded-[3px] border border-border bg-white">
        <Image
          src={link.image_url!}
          alt={link.title}
          fill
          sizes="(min-width: 768px) 160px, (min-width: 640px) 140px, 96px"
          className="object-contain"
        />
      </div>
      {isAi && <figcaption className="mt-1.5 text-[0.6875rem] leading-tight text-muted-foreground">AI-generated image</figcaption>}
    </figure>
  );
}
