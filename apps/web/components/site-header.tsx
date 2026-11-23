import Link from "next/link";

import { navLabel, type Hub } from "@/lib/hub";

export function SiteHeader({ hub, current }: { hub: Hub; current?: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-10 gap-y-3 px-6 py-6">
        <Link href="/" className="font-serif text-2xl transition-colors hover:text-horizon">
          {hub.display_name}
        </Link>
        <nav aria-label="Sections">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-muted-foreground">
            {hub.sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/${section.slug}`}
                  aria-current={section.slug === current ? "page" : undefined}
                  className="transition-colors hover:text-foreground aria-[current=page]:text-horizon"
                >
                  {navLabel(section)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
