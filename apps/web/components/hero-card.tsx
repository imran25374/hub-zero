import Image from "next/image";

import type { Hub } from "@/lib/hub";

/** The identity moment: portrait standing on the horizon, name, one line, profiles. */
export function HeroCard({ hub }: { hub: Hub }) {
  return (
    <section
      aria-labelledby="hub-name"
      className="relative z-10 mx-auto grid w-full max-w-6xl items-end gap-x-14 px-6 pt-10 sm:pt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      {hub.profile_image_url && (
        <div className="mx-auto w-full max-w-[22rem] md:max-w-none">
          <Image
            src={hub.profile_image_url}
            alt={`Portrait of ${hub.display_name}`}
            width={1000}
            height={1115}
            priority
            sizes="(min-width: 1152px) 440px, (min-width: 768px) 40vw, 22rem"
            className="portrait-fade h-auto w-full"
          />
        </div>
      )}
      <div className="pt-6 pb-12 md:pb-20">
        <h1
          id="hub-name"
          className="font-serif text-[clamp(3.25rem,9vw,6rem)] leading-[0.92] font-medium tracking-[-0.015em]"
        >
          {hub.display_name}
        </h1>
        {hub.identity_statement && (
          <p className="mt-6 max-w-[28em] text-xl leading-relaxed text-muted-foreground italic sm:text-2xl">
            {hub.identity_statement}
          </p>
        )}
        {hub.social_links.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 font-sans text-sm">
            {hub.social_links.map((profile) => (
              <li key={profile.url}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="me noopener"
                  className="border-b border-horizon/40 pb-0.5 transition-colors hover:border-horizon hover:text-horizon"
                >
                  {profile.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
