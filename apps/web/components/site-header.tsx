import Image from "next/image";
import Link from "next/link";

import { inNav, navLabel, type Hub } from "@/lib/hub";

/**
 * The sky band that opens every page: the menu, then the page's own opening
 * (a title and a line or two), with the portrait standing on the band's lower
 * edge when `portrait` is set. On the home page the band carries a photograph
 * (`photo`); elsewhere it is the plain gradient.
 */
export function SkyBand({
  hub,
  current,
  photo,
  portrait = false,
  children,
}: {
  hub: Hub;
  current?: string;
  photo?: string | null;
  portrait?: boolean;
  children?: React.ReactNode;
}) {
  const style = photo ? ({ "--sky-photo": `url("${photo}")` } as React.CSSProperties) : undefined;
  return (
    <header className={photo ? "sky-hero" : "sky-band"} style={style}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-10 gap-y-2 px-6 py-5">
        <Link href="/" className="on-sky-text font-serif text-[1.375rem] font-bold text-on-sky no-underline">
          {hub.display_name}
        </Link>
        <nav aria-label="Sections">
          <ul className="on-sky-text flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-on-sky sm:gap-x-7">
            {hub.sections.filter(inNav).map((section) => (
              <li key={section.id}>
                <Link
                  href={`/${section.slug}`}
                  aria-current={section.slug === current ? "page" : undefined}
                  className="underline-offset-4 hover:underline aria-[current=page]:underline"
                >
                  {navLabel(section)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contact" className="underline-offset-4 hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children && (
        <div
          className={`mx-auto grid w-full max-w-6xl items-end gap-x-8 gap-y-6 px-6 pt-10 sm:pt-14 ${
            portrait && hub.profile_image_url ? "md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]" : ""
          }`}
        >
          <div className="pb-10 sm:pb-12">{children}</div>
          {portrait && hub.profile_image_url && (
            <div className="-mb-9 flex justify-start md:-mb-14 md:justify-end">
              <Image
                src={hub.profile_image_url}
                alt={`Portrait of ${hub.display_name}`}
                width={1000}
                height={1115}
                priority
                sizes="(min-width: 768px) 220px, 140px"
                className="portrait-ring size-[140px] md:size-[220px]"
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/** The page title inside the band. */
export function BandTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="on-sky-title font-serif text-[clamp(2.375rem,5vw,3.5rem)] leading-[1.1] text-on-sky">
      {children}
    </h1>
  );
}

/** A line under the band title. */
export function BandLead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`on-sky-text mt-4 max-w-[60ch] text-base leading-relaxed text-on-sky sm:text-lg ${className}`}>
      {children}
    </p>
  );
}
