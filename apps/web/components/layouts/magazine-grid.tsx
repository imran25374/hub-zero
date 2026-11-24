import Image from "next/image";

import { LinkAction } from "@/components/link-action";
import { groupLinks, paragraphs, type HubLink, type HubSection } from "@/lib/hub";

/**
 * Magazine Grid's own page: one row per item, cover on the left, under the
 * group headings. The page title is in the sky band above (see [slug]/page).
 */
export function MagazineGrid({ section }: { section: HubSection }) {
  const body = paragraphs(section.body);

  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-14">
      {body.map((paragraph, index) => (
        <p key={index} className="max-w-[70ch] text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
      {groupLinks(section.links).map((group, index) => (
        <section key={group.label ?? index} aria-label={group.label ?? undefined} className={index === 0 && body.length === 0 ? "" : "mt-14"}>
          {group.label && <h2 className="font-serif text-[1.75rem] leading-tight">{group.label}</h2>}
          <ul className={`divide-y divide-border border-y border-border ${group.label ? "mt-5" : ""}`}>
            {group.links.map((link) => (
              <li key={link.id}>
                <BookRow link={link} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

/** A row on the Books page. */
function BookRow({ link }: { link: HubLink }) {
  return (
    <article className="grid gap-x-8 gap-y-5 py-8 sm:grid-cols-[minmax(0,3fr)_minmax(0,9fr)]">
      <Cover link={link} sizes="(min-width: 1152px) 270px, (min-width: 640px) 24vw, 180px" className="max-w-[180px] sm:max-w-none" />
      <div className="flex flex-col gap-2.5">
        <h3 className="font-serif text-[1.75rem] leading-tight sm:text-[1.875rem]">{link.title}</h3>
        {link.subtitle && <p className="font-serif text-lg leading-snug text-muted-foreground italic">{link.subtitle}</p>}
        {link.description && <p className="mt-1.5 max-w-[66ch] text-base leading-relaxed sm:text-[1.0625rem]">{link.description}</p>}
        <div className="mt-2.5">
          <LinkAction link={link} />
        </div>
      </div>
    </article>
  );
}

function Cover({ link, sizes, className = "" }: { link: HubLink; sizes: string; className?: string }) {
  if (!link.image_url) return null;
  return (
    <div className={className}>
      <Image
        src={link.image_url}
        alt={`Cover of ${link.title}`}
        width={960}
        height={1707}
        sizes={sizes}
        className="cover-shadow h-auto w-full"
      />
    </div>
  );
}
