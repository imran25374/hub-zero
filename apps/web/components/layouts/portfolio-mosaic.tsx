import Image from "next/image";

import { RichParagraph } from "@/components/rich-text";
import { PanelGallery } from "@/components/writing/panel-gallery";
import { VideoTile } from "@/components/writing/video-tile";
import {
  entriesOf,
  formatDate,
  formatDuration,
  groupEntries,
  mediaOf,
  paragraphs,
  type HubSection,
  type ProfileEntry,
} from "@/lib/hub";

/**
 * Portfolio Mosaic: a body of published work, in groups. Each group of
 * publications takes the shape of what it holds: articles two to a row with
 * their banners at LinkedIn's own ratio, vertical video essays four to a row
 * and played on the page, a carousel post as panels to turn through. A thesis
 * closes the page with its cover, its figures and the full text.
 */
export function PortfolioMosaic({ section }: { section: HubSection }) {
  const groups = groupEntries(entriesOf(section, "publication"));
  const theses = entriesOf(section, "thesis");

  return (
    <main id="content" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-y-20 px-6 pt-20 pb-20 md:pt-24">
      {groups.map((group) => {
        const media = mediaOf(group.entries[0]!);
        const label = group.label ?? "Publications";
        const id = `group-${slugify(label)}`;
        return (
          <section key={label} aria-labelledby={id}>
            <GroupHeading id={id} hint={HINTS[media]}>
              {label}
            </GroupHeading>
            {media === "video" && <VideoGroup entries={group.entries} />}
            {media === "gallery" && group.entries.map((entry) => <GalleryPiece key={entry.id} entry={entry} />)}
            {media === "image" && <ArticleGroup entries={group.entries} />}
          </section>
        );
      })}
      {theses.map((entry) => (
        <section key={entry.id} id={entry.id} aria-labelledby={`thesis-${entry.id}`} className="border-t border-border pt-14">
          <GroupHeading id={`thesis-${entry.id}`}>Thesis</GroupHeading>
          <Thesis entry={entry} />
        </section>
      ))}
    </main>
  );
}

const HINTS = {
  image: "Each opens on LinkedIn.",
  video: "Played here; each links to its LinkedIn post.",
  gallery: "Turn the panels here, or open the post on LinkedIn.",
} as const;

function GroupHeading({ id, hint, children }: { id: string; hint?: string; children: React.ReactNode }) {
  return (
    <>
      <h2 id={id} className="text-center font-serif text-[1.5rem] tracking-[0.12em] uppercase sm:text-[2rem]">
        {children}
      </h2>
      {hint && <p className="mt-1 mb-7 text-center text-[0.9375rem] text-muted-foreground">{hint}</p>}
      {!hint && <div className="mb-7" />}
    </>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">{children}</p>
);

const external = { target: "_blank", rel: "noopener" } as const;

/** Articles two to a row, each a link to where it was published. */
function ArticleGroup({ entries }: { entries: ProfileEntry[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
      {entries.map((entry) => (
        <li key={entry.id} id={entry.id}>
          <a href={entry.url ?? "#"} {...(entry.url ? external : {})} className="group flex flex-col gap-3 no-underline">
            {entry.image_url && (
              <Image
                src={entry.image_url}
                alt=""
                width={entry.image_width ?? 1200}
                height={entry.image_height ?? 627}
                sizes="(min-width: 768px) 540px, 90vw"
                className="cover-shadow h-auto w-full rounded-[3px]"
              />
            )}
            {entry.start_date && <Eyebrow>{formatDate(entry.start_date, entry.date_precision)}</Eyebrow>}
            <h3 className="font-serif text-[1.375rem] leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
              {entry.title}
            </h3>
            {entry.body && <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted-foreground">{entry.body}</p>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Vertical films four to a row, played in place. */
function VideoGroup({ entries }: { entries: ProfileEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.id} id={entry.id} className="flex flex-col gap-3">
          <VideoTile src={entry.video_url!} poster={entry.image_url} title={entry.title} />
          <Eyebrow>
            {[
              entry.start_date && formatDate(entry.start_date, entry.date_precision),
              entry.duration_seconds && formatDuration(entry.duration_seconds),
            ]
              .filter(Boolean)
              .join(" · ")}
          </Eyebrow>
          <h3 className="font-serif text-[1.1875rem] leading-tight sm:text-xl">{entry.title}</h3>
          {entry.body && <p className="text-sm leading-relaxed text-muted-foreground">{entry.body}</p>}
          {entry.url && (
            <p>
              <a href={entry.url} {...external} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                Open on LinkedIn
              </a>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

/** A carousel post: its panels beside the text. */
function GalleryPiece({ entry }: { entry: ProfileEntry }) {
  const panels = entry.gallery_urls ?? [];
  return (
    <article id={entry.id} className="grid gap-x-10 gap-y-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-start">
      <PanelGallery panels={panels} title={entry.title} />
      <div className="flex flex-col gap-3">
        <Eyebrow>
          {[entry.start_date && formatDate(entry.start_date, entry.date_precision), `${panels.length} panels`]
            .filter(Boolean)
            .join(" · ")}
        </Eyebrow>
        <h3 className="font-serif text-[1.5rem] leading-tight sm:text-[1.75rem]">{entry.title}</h3>
        {entry.body && (
          <div className="max-w-[60ch] space-y-3 text-base leading-relaxed text-muted-foreground">
            {paragraphs(entry.body).map((paragraph, index) => (
              <p key={index}>
                <RichParagraph text={paragraph} />
              </p>
            ))}
          </div>
        )}
        {entry.url && (
          <p className="mt-1">
            <a href={entry.url} {...external} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Open on LinkedIn
            </a>
          </p>
        )}
      </div>
    </article>
  );
}

/** The thesis: cover page, abstract, figures, and the full text as a PDF. */
function Thesis({ entry }: { entry: ProfileEntry }) {
  const text = paragraphs(entry.body);
  const figures = entry.gallery_urls ?? [];
  return (
    <article className="grid gap-x-10 gap-y-8 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] md:items-start">
      {entry.image_url && (
        <Image
          src={entry.image_url}
          alt={`Cover page of ${entry.title}`}
          width={entry.image_width ?? 745}
          height={entry.image_height ?? 1053}
          sizes="(min-width: 768px) 270px, 60vw"
          className="cover-shadow mx-auto h-auto w-full max-w-[16rem] md:mx-0 md:max-w-none"
        />
      )}
      <div className="flex flex-col gap-4">
        <Eyebrow>
          {[entry.organisation, entry.end_date && formatDate(entry.end_date, entry.date_precision)].filter(Boolean).join(" · ")}
        </Eyebrow>
        <h3 className="font-serif text-[1.5rem] leading-tight sm:text-[1.875rem]">{entry.title}</h3>
        {text.map((paragraph, index) => (
          <p
            key={index}
            className={index === 0 ? "max-w-[70ch] text-base leading-relaxed sm:text-[1.0625rem]" : "max-w-[70ch] text-sm leading-relaxed text-muted-foreground"}
          >
            <RichParagraph text={paragraph} />
          </p>
        ))}
        {figures.map((figure) => (
          <Image
            key={figure}
            src={figure}
            alt={`Figure from ${entry.title}`}
            width={1292}
            height={818}
            sizes="(min-width: 768px) 600px, 90vw"
            className="mt-2 h-auto w-full max-w-[40rem] rounded-[3px] border border-border"
          />
        ))}
        {entry.file_url && (
          <p className="mt-2">
            <a
              href={entry.file_url}
              {...external}
              className="inline-flex min-h-11 items-center rounded-[3px] bg-primary px-[18px] text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-horizon-glow"
            >
              Read the Thesis (PDF)
            </a>
          </p>
        )}
      </div>
    </article>
  );
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
