import Image from "next/image";
import Link from "next/link";

import {
  PROFILE_ENTRY_KINDS,
  type ProfileEntryKind,
} from "@workspace/lib/supabase/database.types";

import { entriesOf, formatPeriod, paragraphs, type HubSection, type ProfileEntry } from "@/lib/hub";

const HEADINGS: Record<Exclude<ProfileEntryKind, "document">, string> = {
  experience: "Experience",
  education: "Education",
  award: "Awards and medals",
  publication: "Publications",
  thesis: "Thesis",
  project: "Projects",
};

/**
 * A professional record (profile_entries), shown in a fixed order under the
 * section's summary: experience, education, awards, publications, thesis,
 * projects. Documents (a CV) appear as buttons above and below it.
 */
export function ProfileRecord({ section }: { section: HubSection }) {
  const documents = entriesOf(section, "document");

  return (
    <>
      <DocumentActions entries={documents} className="mt-10" />
      {PROFILE_ENTRY_KINDS.map((kind) => {
        if (kind === "document") return null;
        const entries = entriesOf(section, kind);
        if (entries.length === 0) return null;
        return (
          <section key={kind} aria-labelledby={`record-${kind}`} className="mt-16 md:mt-20">
            <h2 id={`record-${kind}`} className="flex items-center gap-5 font-serif text-[1.75rem] italic">
              {HEADINGS[kind]}
              <span aria-hidden className="h-px flex-1 bg-border" />
            </h2>
            {kind === "experience" ? (
              <Timeline entries={entries} />
            ) : kind === "award" ? (
              <Awards entries={entries} />
            ) : kind === "publication" ? (
              <Publications entries={entries} />
            ) : (
              <ul className="mt-8 space-y-10">
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
            )}
          </section>
        );
      })}
      <DocumentActions entries={documents} className="mt-16 md:mt-20" />
    </>
  );
}

/** Period, title, organisation and text of one entry. */
function EntryText({ entry }: { entry: ProfileEntry }) {
  const period = formatPeriod(entry);
  return (
    <>
      {period && <p className="font-sans text-sm text-muted-foreground tabular-nums">{period}</p>}
      <h3 className="mt-1 font-serif text-2xl leading-snug">{entry.title}</h3>
      {entry.organisation && <p className="text-lg leading-snug text-muted-foreground italic">{entry.organisation}</p>}
      {paragraphs(entry.body).map((paragraph, index) => (
        <p key={index} className="mt-3 text-[1.125rem] leading-relaxed">
          {paragraph}
        </p>
      ))}
    </>
  );
}

/** Career as a timeline, most recent first; current roles carry a lit marker. */
function Timeline({ entries }: { entries: ProfileEntry[] }) {
  return (
    <ol className="mt-9 border-l border-border">
      {entries.map((entry) => (
        <li key={entry.id} className="relative pb-11 pl-8 last:pb-1">
          <span
            aria-hidden
            className={`absolute top-[0.4rem] -left-[4.5px] size-2 rounded-full ${
              entry.is_current
                ? "bg-horizon shadow-[0_0_10px_2px_rgb(246_200_144/0.45)]"
                : "bg-[color-mix(in_srgb,var(--muted-foreground)_70%,transparent)]"
            }`}
          />
          <EntryText entry={entry} />
        </li>
      ))}
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
  const className = "transition-colors hover:text-horizon underline decoration-horizon/40 underline-offset-[5px] decoration-1 hover:decoration-horizon";
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

/** Downloadable documents such as a CV, as buttons. A document without a file yet shows as pending. */
function DocumentActions({ entries, className }: { entries: ProfileEntry[]; className?: string }) {
  if (entries.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-4 font-sans ${className ?? ""}`}>
      {entries.map((entry) => {
        const href = entry.file_url ?? entry.url;
        return (
          <li key={entry.id}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center rounded-[3px] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-horizon-glow"
              >
                {entry.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="inline-flex items-center rounded-[3px] border border-dashed border-border px-5 py-2.5 text-sm text-muted-foreground">
                {entry.title}: file not uploaded yet
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
