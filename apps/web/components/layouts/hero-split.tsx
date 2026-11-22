import Image from "next/image";

import { FormSlot } from "@/components/form-slot";
import { paragraphs, type Hub, type HubSection } from "@/lib/hub";

/**
 * Hero Split: text on one side; on the other, the section's form if it has
 * one, otherwise its image (or the hub portrait).
 */
export function HeroSplit({ hub, section }: { hub: Hub; section: HubSection }) {
  const image = section.form_provider ? null : (section.icon_image_url ?? hub.profile_image_url);
  const body = paragraphs(section.body);

  return (
    <main
      id="content"
      className="mx-auto grid w-full max-w-6xl flex-1 gap-x-16 gap-y-12 px-6 py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:py-20"
    >
      {/* With a form, the text comes first on every screen size; the form follows. */}
      <div className={section.form_provider ? "order-2 md:pt-24" : ""}>
        {section.form_provider ? (
          <FormSlot provider={section.form_provider} formId={section.form_id} />
        ) : (
          image && (
            <div className="mx-auto max-w-[22rem] md:sticky md:top-10 md:max-w-none">
              <Image
                src={image}
                alt={`Portrait of ${hub.display_name}`}
                width={1000}
                height={1115}
                sizes="(min-width: 1152px) 440px, (min-width: 768px) 40vw, 22rem"
                className="portrait-fade h-auto w-full"
              />
            </div>
          )
        )}
      </div>

      <div className={section.form_provider ? "order-1" : ""}>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-medium">
          {section.title}
        </h1>
        {body.length > 0 ? (
          <div className="mt-8 max-w-[34em] space-y-5 text-[1.3rem] leading-[1.65]">
            {body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          section.description && (
            <p className="mt-6 max-w-[30em] text-2xl leading-snug text-muted-foreground">
              {section.description}
            </p>
          )
        )}
      </div>
    </main>
  );
}
