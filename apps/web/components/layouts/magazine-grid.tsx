import Image from "next/image";

import { LinkAction } from "@/components/link-action";
import { groupLinks, paragraphs, type HubLink, type HubSection } from "@/lib/hub";

/**
 * Magazine Grid: cards with an image, gathered under their group headings.
 * A group with a single item is shown as one wide feature.
 */
export function MagazineGrid({ section }: { section: HubSection }) {
  const groups = groupLinks(section.links);
  const body = paragraphs(section.body);

  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 md:py-20">
      <header className="max-w-[40em]">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-medium">
          {section.title}
        </h1>
        {section.description && (
          <p className="mt-5 text-2xl leading-snug text-muted-foreground">{section.description}</p>
        )}
        {body.map((paragraph, index) => (
          <p key={index} className="mt-4 text-xl leading-relaxed">
            {paragraph}
          </p>
        ))}
      </header>

      {groups.map((group, index) => (
        <section key={group.label ?? index} aria-label={group.label ?? undefined} className="mt-16 md:mt-20">
          {group.label && (
            <h2 className="flex items-center gap-5 font-serif text-2xl italic">
              {group.label}
              <span aria-hidden className="h-px flex-1 bg-border" />
            </h2>
          )}
          {group.links.length === 1 ? (
            <FeatureCard link={group.links[0]} />
          ) : (
            <ul className="mt-10 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {group.links.map((link) => (
                <li key={link.id}>
                  <LinkCard link={link} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}

function Cover({ link, sizes, framed = true }: { link: HubLink; sizes: string; framed?: boolean }) {
  if (!link.image_url) return null;
  const image = (
    <Image
      src={link.image_url}
      alt={`Cover of ${link.title}`}
      width={960}
      height={1707}
      sizes={sizes}
      className="h-auto max-h-full w-full rounded-[2px] object-contain shadow-[0_28px_50px_-28px_rgb(234_169_106/0.45)]"
    />
  );
  // In a row, covers of slightly different heights stand on a common baseline.
  return framed ? <div className="flex aspect-[9/16] items-end">{image}</div> : image;
}

function LinkText({ link, large = false }: { link: HubLink; large?: boolean }) {
  return (
    <>
      <h3 className={large ? "font-serif text-4xl leading-tight" : "font-serif text-[1.75rem] leading-tight"}>
        {link.title}
      </h3>
      {link.subtitle && (
        <p className={`mt-1.5 leading-snug text-muted-foreground italic ${large ? "text-xl" : "text-lg"}`}>
          {link.subtitle}
        </p>
      )}
      {link.description && (
        <p className={`mt-4 leading-relaxed ${large ? "text-xl" : "text-[1.125rem]"}`}>{link.description}</p>
      )}
    </>
  );
}

function LinkCard({ link }: { link: HubLink }) {
  return (
    <article className="flex h-full flex-col">
      <Cover link={link} sizes="(min-width: 1152px) 340px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
      <div className="mt-7">
        <LinkText link={link} />
      </div>
      <div className="mt-auto pt-6">
        <LinkAction link={link} />
      </div>
    </article>
  );
}

function FeatureCard({ link }: { link: HubLink }) {
  return (
    <article className="mt-10 grid items-end gap-x-14 gap-y-8 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div className="max-w-[22rem]">
        <Cover link={link} sizes="(min-width: 768px) 352px, 90vw" framed={false} />
      </div>
      <div className="max-w-[36em] md:pb-4">
        <LinkText link={link} large />
        <div className="mt-7">
          <LinkAction link={link} />
        </div>
      </div>
    </article>
  );
}
