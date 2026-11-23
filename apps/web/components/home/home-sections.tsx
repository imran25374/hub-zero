import Link from "next/link";

import { FormSlot } from "@/components/form-slot";
import { BookGrid } from "@/components/layouts/magazine-grid";
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

const sectionHeading = "font-serif text-[1.75rem] leading-tight sm:text-[2.125rem]";

/** Hero Split without a form: the short version, and a button to the rest. */
function HomeIntro({ hub, section }: { hub: Hub; section: HubSection }) {
  const text = section.excerpt ? paragraphs(section.excerpt) : paragraphs(section.body).slice(0, 1);
  return (
    <section
      id={section.slug}
      aria-labelledby={headingId(section)}
      className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-4 px-6 pt-20 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:pt-28"
    >
      <div>
        <h2 id={headingId(section)} className={sectionHeading}>
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-3 hidden text-[0.9375rem] leading-snug text-muted-foreground md:block">{section.description}</p>
        )}
      </div>
      <div>
        <div className="max-w-[66ch] space-y-5 text-[1.0625rem] leading-[1.6] sm:text-lg">
          {text.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6">
          <Link
            href={ctaHref(hub, section)}
            className="inline-flex min-h-11 items-center rounded-[3px] border border-primary px-[18px] text-sm font-semibold text-primary transition-colors hover:bg-secondary"
          >
            {section.cta_label ?? "Read more"}
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Magazine Grid: the books in one row of covers, with a link to the full page. */
function HomeGrid({ section }: { section: HubSection }) {
  return (
    <section
      id={section.slug}
      aria-labelledby={headingId(section)}
      className="mx-auto w-full max-w-6xl px-6 pt-20 md:pt-28"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={headingId(section)} className={sectionHeading}>
          {section.title}
        </h2>
        <Link href={`/${section.slug}`} className="text-sm font-semibold text-horizon underline-offset-4 hover:underline">
          All {section.links.length === 4 ? "four" : section.links.length} books
        </Link>
      </div>
      {section.description && (
        <p className="mt-2 max-w-[70ch] text-base leading-relaxed text-muted-foreground">{section.description}</p>
      )}
      <BookGrid links={section.links} level={3} />
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
      <div className="grid items-center gap-x-14 gap-y-8 rounded-[3px] border border-border bg-card px-7 py-10 sm:px-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:px-14 md:py-14">
        <div>
          <h2 id={headingId(section)} className={sectionHeading}>
            {section.title}
          </h2>
          {section.description && (
            <p className="mt-4 max-w-[30em] text-lg leading-relaxed">{section.description}</p>
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
