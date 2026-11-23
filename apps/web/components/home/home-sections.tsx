import Link from "next/link";

import { FormSlot } from "@/components/form-slot";
import { LinkGroups } from "@/components/layouts/magazine-grid";
import { ctaHref, paragraphs, type Hub, type HubSection } from "@/lib/hub";

/**
 * Whether a section is shown in full on the home page. Sections set to
 * "inline" whose layout has no home version yet appear as tiles instead.
 */
export function rendersInline(section: HubSection): boolean {
  return (
    section.home_display === "inline" &&
    (section.layout_id === "hero-split" || section.layout_id === "magazine-grid")
  );
}

/** One section of the long-scroll home page, in the form its layout calls for. */
export function HomeSection({ hub, section }: { hub: Hub; section: HubSection }) {
  if (section.layout_id === "magazine-grid") return <HomeGrid section={section} />;
  if (section.form_provider) return <HomeSignup section={section} />;
  return <HomeIntro hub={hub} section={section} />;
}

const headingId = (section: HubSection) => `${section.slug}-heading`;

/** Hero Split without a form: the short version, and a link to the rest. */
function HomeIntro({ hub, section }: { hub: Hub; section: HubSection }) {
  const text = section.excerpt ? paragraphs(section.excerpt) : paragraphs(section.body).slice(0, 1);
  return (
    <section
      id={section.slug}
      aria-labelledby={headingId(section)}
      className="mx-auto grid w-full max-w-6xl gap-x-14 gap-y-5 px-6 pt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:pt-24"
    >
      <h2 id={headingId(section)} className="font-serif text-3xl leading-tight md:pt-1 md:text-[2.25rem]">
        {section.title}
      </h2>
      <div>
        <div className="max-w-[34em] space-y-5 text-[1.3rem] leading-[1.65]">
          {text.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-8 font-sans text-sm">
          <Link
            href={ctaHref(hub, section)}
            className="border-b border-horizon/40 pb-0.5 transition-colors hover:border-horizon hover:text-horizon"
          >
            {section.cta_label ?? "Read more"} <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Magazine Grid: the same cards as the section's own page. */
function HomeGrid({ section }: { section: HubSection }) {
  return (
    <section
      id={section.slug}
      aria-labelledby={headingId(section)}
      className="mx-auto w-full max-w-6xl px-6 pt-20 md:pt-28"
    >
      <header className="max-w-[40em]">
        <h2
          id={headingId(section)}
          className="font-serif text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.05] font-medium"
        >
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-4 text-xl leading-snug text-muted-foreground sm:text-2xl">{section.description}</p>
        )}
      </header>
      <LinkGroups links={section.links} level={3} />
    </section>
  );
}

/** Hero Split with a form: a framed box with the offer on one side and the form on the other. */
function HomeSignup({ section }: { section: HubSection }) {
  return (
    <section
      id={section.slug}
      aria-labelledby={headingId(section)}
      className="mx-auto w-full max-w-6xl px-6 pt-20 md:pt-28"
    >
      <div className="grid items-center gap-x-14 gap-y-8 rounded-[3px] border border-horizon/25 bg-card px-7 py-10 sm:px-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:px-14 md:py-14">
        <div>
          <h2 id={headingId(section)} className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-tight">
            {section.title}
          </h2>
          {section.description && (
            <p className="mt-4 max-w-[30em] text-xl leading-relaxed">{section.description}</p>
          )}
        </div>
        {section.form_provider && (
          <div className="border-t border-border pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-14">
            <FormSlot provider={section.form_provider} formId={section.form_id} framed={false} />
          </div>
        )}
      </div>
    </section>
  );
}
