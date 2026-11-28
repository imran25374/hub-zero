"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { LinkAction } from "@/components/link-action";
import type { HubLink } from "@/lib/hub";

/** Tag on a link whose image is AI-generated; the page then says so under the picture. */
export const AI_IMAGE_TAG = "ai-image";

type View = "list" | "grid";
type Group = { label: string | null; links: HubLink[] };

/**
 * A section's links in groups, as a grid of cards or a list (picture, text,
 * button in a row). A section with pictures opens as a grid; a visitor who
 * picks List keeps it on their next visit (remembered in this browser, per
 * section). The switch only appears when the section has pictures.
 */
// The remembered choice lives in localStorage; useSyncExternalStore reads it after
// hydration (the server renders the default), so there is no mismatch.
const listeners = new Set<() => void>();
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}
function readView(key: string): View {
  try {
    return window.localStorage.getItem(key) === "list" ? "list" : "grid";
  } catch {
    return "grid"; // Storage can be unavailable (private modes); the default is fine.
  }
}

/**
 * The item a visitor was sent to: ?item=echo-dot (ads and posts; survives the
 * tracking parameters Meta appends) or #echo-dot (pins, older links).
 */
function linkedItem(): string | null {
  const fromQuery = new URLSearchParams(window.location.search).get("item");
  const fromHash = decodeURIComponent(window.location.hash.slice(1));
  return fromQuery || fromHash || null;
}
function subscribeToLocation(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

const ITEM_CLASS = "scroll-mt-24 target:rounded-[3px] target:bg-secondary target:outline target:outline-8 target:outline-secondary";
const FOCUSED_CLASS = "rounded-[3px] bg-secondary outline outline-8 outline-secondary";

export function LinkCollection({
  sectionId,
  groups,
  showSwitch,
  hideGroupHeadings = false,
}: {
  sectionId: string;
  groups: Group[];
  showSwitch: boolean;
  /** On a category page the band already names the one group shown. */
  hideGroupHeadings?: boolean;
}) {
  const key = `hub-view:${sectionId}`;
  const fallback: View = showSwitch ? "grid" : "list";
  const stored = useSyncExternalStore(subscribe, () => (showSwitch ? readView(key) : "list"), () => fallback);
  const [picked, setPicked] = useState<View | null>(null);
  const focused = useSyncExternalStore(subscribeToLocation, linkedItem, () => null);
  const view = picked ?? stored;

  // A link to one item (?item=echo-dot from an ad, #echo-dot from a pin) lands on
  // it and highlights it; scroll again when the view swaps (List remembered).
  useEffect(() => {
    if (focused) document.getElementById(focused)?.scrollIntoView({ block: "start" });
  }, [view, focused]);

  const choose = (next: View) => {
    setPicked(next);
    try {
      window.localStorage.setItem(key, next);
    } catch {
      // Not remembered; the choice still applies on this page.
    }
    listeners.forEach((notify) => notify());
  };

  return (
    <>
      {showSwitch && <ViewSwitch view={view} onChange={choose} />}
      {groups.map((group, index) => (
        <section key={group.label ?? index} className={index === 0 ? (showSwitch ? "mt-4" : "") : "mt-14"}>
          {group.label && !hideGroupHeadings && <h2 className="font-serif text-[1.75rem]">{group.label}</h2>}
          {view === "grid" ? (
            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {group.links.map((link) => (
                <li key={link.id} id={link.anchor ?? undefined} className={`${ITEM_CLASS} ${link.anchor && link.anchor === focused ? FOCUSED_CLASS : ""}`}>
                  <GridCard link={link} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {group.links.map((link) => (
                <li key={link.id} id={link.anchor ?? undefined} className={`${ITEM_CLASS} ${link.anchor && link.anchor === focused ? FOCUSED_CLASS : ""}`}>
                  <ListRow link={link} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}

function ViewSwitch({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  const option = (value: View, label: string, icon: ReactNode) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      aria-pressed={view === value}
      className={`inline-flex min-h-10 items-center gap-2 px-3.5 text-sm font-semibold transition-colors ${
        view === value ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div className="flex justify-end">
      <div role="group" aria-label="Show the picks as" className="inline-flex overflow-hidden rounded-[3px] border border-border">
        {option("list", "List", <ListIcon />)}
        <span aria-hidden className="w-px bg-border" />
        {option("grid", "Grid", <GridIcon />)}
      </div>
    </div>
  );
}

/** List view: picture on the left (when there is one), text, then the button. */
function ListRow({ link }: { link: HubLink }) {
  return (
    <div
      className={`grid gap-4 py-6 md:items-center ${
        link.image_url
          ? "grid-cols-[96px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[140px_minmax(0,1fr)] md:grid-cols-[160px_minmax(0,2fr)_auto] md:gap-x-8"
          : "md:grid-cols-[minmax(0,2fr)_auto]"
      }`}
    >
      {link.image_url && <LinkPicture link={link} sizes="(min-width: 768px) 160px, (min-width: 640px) 140px, 96px" />}
      <div>
        <h3 className="font-serif text-[1.375rem]">{link.title}</h3>
        {link.subtitle && <p className="mt-1 text-muted-foreground italic">{link.subtitle}</p>}
        {link.description && <p className="mt-2 max-w-[38em] text-lg">{link.description}</p>}
      </div>
      <div className={link.image_url ? "col-span-2 md:col-span-1" : ""}>
        <LinkAction link={link} />
      </div>
    </div>
  );
}

/** Grid view: picture on top, name, two lines of the description, the button. */
function GridCard({ link }: { link: HubLink }) {
  return (
    <article className="flex h-full flex-col">
      {link.image_url && <LinkPicture link={link} sizes="(min-width: 1024px) 270px, (min-width: 640px) 31vw, 46vw" className="w-full" />}
      <h3 className={`font-serif text-[1.125rem] leading-snug sm:text-[1.25rem] ${link.image_url ? "mt-3" : ""}`}>{link.title}</h3>
      {link.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-foreground/85">{link.description}</p>}
      <div className="mt-auto pt-3">
        <LinkAction link={link} compact />
      </div>
    </article>
  );
}

/** The link's picture, square, on white so product shots sit cleanly; a small note when it is AI-generated. */
function LinkPicture({ link, sizes, className = "self-start" }: { link: HubLink; sizes: string; className?: string }) {
  const isAi = link.tags.includes(AI_IMAGE_TAG);
  return (
    <figure className={className}>
      <div className="relative aspect-square overflow-hidden rounded-[3px] border border-border bg-white">
        <Image src={link.image_url!} alt={link.title} fill sizes={sizes} className="object-contain" />
      </div>
      {isAi && <figcaption className="mt-1.5 text-[0.6875rem] leading-tight text-muted-foreground">AI-generated image</figcaption>}
    </figure>
  );
}

function ListIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1.5" y="2" width="4" height="4" rx="0.5" />
      <rect x="1.5" y="10" width="4" height="4" rx="0.5" />
      <path d="M8 4h6.5M8 12h6.5" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1.5" y="1.5" width="5" height="5" rx="0.5" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="0.5" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="0.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
    </svg>
  );
}
