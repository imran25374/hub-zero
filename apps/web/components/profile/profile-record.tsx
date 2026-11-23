import Image from "next/image";
import Link from "next/link";

import { PROFILE_ENTRY_KINDS, type ProfileEntryKind } from "@workspace/lib/supabase/database.types";

import {
  childrenOf,
  entriesOf,
  formatPeriod,
  textBlocks,
  type HubSection,
  type ProfileEntry,
} from "@/lib/hub";

type RecordKind = Exclude<ProfileEntryKind, "header" | "document">;

const HEADINGS: Record<RecordKind, string> = {
  achievement: "Key achievements",
  skill_group: "Areas of expertise",
  experience: "Experience",
  education: "Education",
  training: "Training and qualifications",
  award: "Awards and honours",
  exposure: "International exposure",
  publication: "Publications",
  thesis: "Thesis",
  project: "Projects",
  interest: "Beyond work",
  language: "Languages",
};

const isRecordKind = (kind: ProfileEntryKind): kind is RecordKind => kind !== "header" && kind !== "document";

/** Name line, headline and header lines (rank, place, availability, contact links) of a profile page. */
export function ProfileHeader({ section }: { section: HubSection }) {
  const lines = entriesOf(section, "header");
  const text = lines.filter((line) => !line.url);
  const links = lines.filter((line) => line.url);
  return (
    <>
      {section.description && (
        <p className="mt-5 max-w-[30em] text-2xl leading-snug text-muted-foreground italic">{section.description}</p>
      )}
      {text.length > 0 && (
        <ul className="mt-6 space-y-1 font-sans text-[0.9375rem] leading-relaxed">
          {text.map((line) => (
            <li key={line.id}>{line.title}</li>
          ))}
        </ul>
      )}
      {links.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-sans text-sm">
          {links.map((line) => (
            <li key={line.id}>
              <a
                href={line.url!}
                {...(line.url!.startsWith("mailto:") ? {} : { target: "_blank", rel: "me noopener" })}
                className="border-b border-horizon/40 pb-0.5 transition-colors hover:border-horizon hover:text-horizon"
              >
                {line.title}
                {!line.url!.startsWith("mailto:") && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * The professional record (profile_entries) under a profile's summary, in a
 * fixed order. Documents (a CV) appear as buttons above and below it.
 */
export function ProfileRecord({ section }: { section: HubSection }) {
  const documents = entriesOf(section, "document");

  return (
    <>
      <DocumentActions entries={documents} className="mt-10" />
      {PROFILE_ENTRY_KINDS.filter(isRecordKind).map((kind) => {
        const entries = entriesOf(section, kind);
        if (entries.length === 0) return null;
        return (
          <section key={kind} aria-labelledby={`record-${kind}`} className="mt-16 md:mt-20">
            <h2 id={`record-${kind}`} className="flex items-center gap-5 font-serif text-[1.75rem] italic">
              {HEADINGS[kind]}
              <span aria-hidden className="h-px flex-1 bg-border" />
            </h2>
            <RecordBlock kind={kind} entries={entries} section={section} />
          </section>
        );
      })}
      <DocumentActions entries={documents} className="mt-16 md:mt-20" />
    </>
  );
}

function RecordBlock({ kind, entries, section }: { kind: RecordKind; entries: ProfileEntry[]; section: HubSection }) {
  switch (kind) {
    case "achievement":
      return (
        <ul className="mt-8 space-y-5">
          {entries.map((entry) => (
            <li key={entry.id} className="relative pl-6 text-[1.125rem] leading-relaxed">
              <span aria-hidden className="absolute top-[0.8em] left-0 h-px w-3 bg-horizon" />
              {entry.title}
            </li>
          ))}
        </ul>
      );
    case "skill_group":
      return (
        <dl className="mt-8 space-y-7">
          {entries.map((entry) => (
            <div key={entry.id}>
              <dt className="font-serif text-xl">{entry.title}</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2 font-sans text-[0.8125rem]">
                  {itemsOf(entry).map((item) => (
                    <li key={item} className="rounded-[3px] border border-border px-2.5 py-1 text-foreground/90">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      );
    case "experience":
      return <Timeline entries={entries} section={section} />;
    case "award":
      return <Awards entries={entries} />;
    case "publication":
      return <Publications entries={entries} />;
    case "exposure":
    case "interest":
      return (
        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          {entries.map((entry) => (
            <div key={entry.id} className="contents">
              <dt className="font-sans text-sm text-muted-foreground sm:pt-1">{entry.title}</dt>
              <dd className="text-[1.125rem] leading-relaxed">{entry.body}</dd>
            </div>
          ))}
        </dl>
      );
    case "language":
      return (
        <p className="mt-8 text-[1.125rem]">
          {entries.map((entry) => (entry.body ? `${entry.title} (${entry.body})` : entry.title)).join(", ")}
        </p>
      );
    default:
      // education, training, thesis, project
      return (
        <ul className="mt-8 space-y-9">
          {entries.map((entry) => (
            <li key={entry.id}>
              <EntryText entry={entry} />
              {entry.file_url && (
                <p className="mt-5 font-sans text-sm">
                  <FileLink href={entry.file_url}>Download the full text (PDF)</FileLink>
                </p>
              )}
            </li>
          ))}
        </ul>
      );
  }
}

/** Bullet items of an entry body ("- item" lines), e.g. the skills in a group. */
function itemsOf(entry: ProfileEntry): string[] {
  return textBlocks(entry.body).flatMap((block) => (block.type === "list" ? block.items : [block.text]));
}

/** An entry body as paragraphs, bullet lists and sub-headings. */
function RichText({ text, level }: { text: string | null; level: 3 | 4 }) {
  const SubHeading = level === 3 ? "h4" : "h5";
  return textBlocks(text).map((block, index) => {
    if (block.type === "heading") {
      return (
        <SubHeading key={index} className="mt-6 font-sans text-sm font-medium text-horizon">
          {block.text}
        </SubHeading>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={index} className="mt-3 list-disc space-y-2 pl-5 marker:text-muted-foreground">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={index} className="mt-3">
        {block.text}
      </p>
    );
  });
}

/** Period, title, organisation and place, and text of one entry. */
function EntryText({ entry, level = 3 }: { entry: ProfileEntry; level?: 3 | 4 }) {
  const period = formatPeriod(entry);
  const where = [entry.organisation, entry.place].filter(Boolean).join(", ");
  const Title = level === 3 ? "h3" : "h4";
  return (
    <>
      {period && <p className="font-sans text-sm text-muted-foreground tabular-nums">{period}</p>}
      <Title className={`mt-1 font-serif leading-snug ${level === 3 ? "text-2xl" : "text-xl"}`}>{entry.title}</Title>
      {where && <p className="text-lg leading-snug text-muted-foreground italic">{where}</p>}
      {entry.body && (
        <div className={level === 3 ? "text-[1.125rem] leading-relaxed" : "text-[1.0625rem] leading-relaxed"}>
          <RichText text={entry.body} level={level} />
        </div>
      )}
    </>
  );
}

/** Career as a timeline, most recent first; current roles carry a lit marker. Nested appointments follow their parent. */
function Timeline({ entries, section, nested = false }: { entries: ProfileEntry[]; section: HubSection; nested?: boolean }) {
  return (
    <ol className={nested ? "mt-8 border-l border-border/70" : "mt-9 border-l border-border"}>
      {entries.map((entry) => {
        const children = childrenOf(section, entry);
        return (
          <li key={entry.id} className={`relative pl-7 ${nested ? "pb-8 last:pb-1" : "pb-12 last:pb-1 sm:pl-8"}`}>
            <span
              aria-hidden
              className={`absolute top-[0.4rem] rounded-full ${nested ? "-left-[3.5px] size-1.5" : "-left-[4.5px] size-2"} ${
                entry.is_current
                  ? "bg-horizon shadow-[0_0_10px_2px_rgb(246_200_144/0.45)]"
                  : "bg-[color-mix(in_srgb,var(--muted-foreground)_70%,transparent)]"
              }`}
            />
            <EntryText entry={entry} level={nested ? 4 : 3} />
            {children.length > 0 && <Timeline entries={children} section={section} nested />}
          </li>
        );
      })}
    </ol>
  );
}

/** Medals and awards: the photo when there is one, with its caption. */
function Awards({ entries }: { entries: ProfileEntry[] }) {
  return (
    <ul className="mt-9 grid gap-x-10 gap-y-12 sm:grid-cols-2">
      {entries.map((entry) => (
        <li key={entry.id}>
          <figure>
            {entry.image_url && (
              <Image
                src={entry.image_url}
                alt={`The ${entry.title}`}
                width={800}
                height={800}
                sizes="(min-width: 1152px) 300px, (min-width: 640px) 40vw, 90vw"
                className="mb-6 aspect-square w-full max-w-[18rem] rounded-[2px] object-contain"
              />
            )}
            <figcaption>
              <EntryText entry={entry} />
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** Writing as a list of titled links. */
function Publications({ entries }: { entries: ProfileEntry[] }) {
  return (
    <ul className="mt-8 divide-y divide-border border-y border-border">
      {entries.map((entry) => {
        const period = formatPeriod(entry);
        return (
          <li key={entry.id} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
            <div>
              <h3 className="font-serif text-[1.375rem] leading-snug">
                {entry.url ? <EntryLink href={entry.url}>{entry.title}</EntryLink> : entry.title}
              </h3>
              {entry.organisation && <p className="text-muted-foreground italic">{entry.organisation}</p>}
            </div>
            {period && <p className="font-sans text-sm text-muted-foreground tabular-nums">{period}</p>}
          </li>
        );
      })}
    </ul>
  );
}

/** A link to a page on this site, or to another site in a new tab. */
function EntryLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className =
    "underline decoration-horizon/40 decoration-1 underline-offset-[5px] transition-colors hover:text-horizon hover:decoration-horizon";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function FileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="border-b border-horizon/40 pb-0.5 transition-colors hover:border-horizon hover:text-horizon"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Downloadable documents such as a CV, as buttons. Only entries with a file or link are shown. */
function DocumentActions({ entries, className }: { entries: ProfileEntry[]; className?: string }) {
  const ready = entries.filter((entry) => entry.file_url ?? entry.url);
  if (ready.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-4 font-sans ${className ?? ""}`}>
      {ready.map((entry) => (
        <li key={entry.id}>
          <a
            href={(entry.file_url ?? entry.url)!}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center rounded-[3px] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-horizon-glow"
          >
            {entry.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
