import Image from "next/image";

import { LinkAction } from "@/components/link-action";
import { groupLinks, isGift, paragraphs, type HubLink, type HubSection } from "@/lib/hub";

/**
 * Magazine Grid's own page: one row per item, cover on the left, under the
 * group headings. The page title is in the sky band above (see [slug]/page).
 * A link's anchor becomes its row's id, so /books#before-us lands on that book
 * (pins and posts use it) and the row is tinted while it is the URL's target.
 * Links tagged "gift" are not rows: they make the gift panel above the list.
 */
export function MagazineGrid({ section }: { section: HubSection }) {
  const body = paragraphs(section.body);
  const gifts = section.links.filter(isGift);
  const items = section.links.filter((link) => !isGift(link));

  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-14">
      {body.map((paragraph, index) => (
        <p key={index} className="max-w-[70ch] text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
      {gifts.length > 0 && <GiftPanel gifts={gifts} items={items} spaced={body.length > 0} />}
      {groupLinks(items).map((group, index) => (
        <section
          key={group.label ?? index}
          aria-label={group.label ?? undefined}
          className={index === 0 && body.length === 0 && gifts.length === 0 ? "" : "mt-14"}
        >
          {group.label && <h2 className="font-serif text-[1.75rem] leading-tight">{group.label}</h2>}
          <ul className={`divide-y divide-border border-y border-border ${group.label ? "mt-5" : ""}`}>
            {group.links.map((link) => (
              <li key={link.id} id={link.anchor ?? undefined} className="scroll-mt-24 target:rounded-[3px] target:bg-secondary target:outline target:outline-8 target:outline-secondary">
                <BookRow link={link} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

/**
 * The gift panel: the first gift link's title, line and text, the covers of the
 * books in its group (fanned), and a button for each gift link: the first solid
 * (e.g. all three paperbacks to the Amazon cart), the rest outlined (e.g. the
 * printable gift card). Its anchor (e.g. /books#gift) lands on the panel.
 */
function GiftPanel({ gifts, items, spaced }: { gifts: HubLink[]; items: HubLink[]; spaced: boolean }) {
  const [lead, ...more] = gifts;
  const covers = items.filter((link) => link.group_label === lead.group_label && link.image_url).slice(0, 4);
  return (
    <section
      id={lead.anchor ?? undefined}
      aria-labelledby="gift-heading"
      className={`scroll-mt-24 rounded-[3px] border border-border bg-card px-6 py-8 target:outline target:outline-8 target:outline-secondary sm:px-10 sm:py-10 ${
        spaced ? "mt-10" : ""
      }`}
    >
      <div className="grid items-center gap-x-12 gap-y-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {covers.length > 0 && (
          <ul className="flex items-end justify-center" aria-label={`Covers: ${covers.map((link) => link.title).join(", ")}`}>
            {covers.map((link, index) => (
              <li
                key={link.id}
                className="w-[31%] max-w-[150px] shrink-0"
                style={{
                  marginLeft: index === 0 ? 0 : "-6%",
                  transform: `rotate(${(index - (covers.length - 1) / 2) * 5}deg) translateY(${index === (covers.length - 1) / 2 ? 0 : 6}px)`,
                  zIndex: covers.length - Math.abs(index - (covers.length - 1) / 2),
                }}
              >
                <Image
                  src={link.image_url as string}
                  alt=""
                  width={960}
                  height={1707}
                  sizes="150px"
                  className="cover-shadow h-auto w-full"
                />
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-2.5">
          <h2 id="gift-heading" className="font-serif text-[1.75rem] leading-tight sm:text-[2rem]">
            {lead.title}
          </h2>
          {lead.subtitle && <p className="font-serif text-lg leading-snug text-muted-foreground italic">{lead.subtitle}</p>}
          {lead.description && <p className="mt-1.5 max-w-[60ch] text-base leading-relaxed sm:text-[1.0625rem]">{lead.description}</p>}
          <div className="mt-3 flex flex-col gap-4">
            <LinkAction link={lead} />
            {more.map((link) => (
              <div key={link.id} id={link.anchor ?? undefined} className="flex flex-col gap-2 border-t border-border pt-4">
                {link.description && <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted-foreground">{link.description}</p>}
                <LinkAction link={link} variant="outline" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
