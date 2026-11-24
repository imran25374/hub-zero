import Image from "next/image";

import { FormSlot } from "@/components/form-slot";
import { RichParagraph } from "@/components/rich-text";
import { ProfileRecord } from "@/components/profile/profile-record";
import { isProfilePage, paragraphs, type Hub, type HubSection } from "@/lib/hub";

/**
 * Hero Split. Its title and headline are in the sky band above. A section with
 * profile entries is a profile page: the summary, then the full record. One
 * with a form shows the text beside the form. Otherwise the text sits beside
 * the section's image (or the hub portrait).
 */
export function HeroSplit({ hub, section }: { hub: Hub; section: HubSection }) {
  const body = paragraphs(section.body);
  const isProfile = isProfilePage(section);

  if (isProfile) {
    return (
      <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 pt-16 pb-16 md:pt-24">
        {body.length > 0 && (
          <div className="max-w-[76ch] space-y-4 text-[1.0625rem] leading-[1.65] sm:text-lg">
            {body.map((paragraph, index) => (
              <p key={index}>
              <RichParagraph text={paragraph} />
            </p>
            ))}
          </div>
        )}
        <ProfileRecord section={section} />
      </main>
    );
  }

  const image = section.form_provider ? null : (section.icon_image_url ?? hub.profile_image_url);
  return (
    <main
      id="content"
      className="mx-auto grid w-full max-w-6xl flex-1 gap-x-12 gap-y-10 px-6 py-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:py-16"
    >
      <div className={section.form_provider ? "order-2" : ""}>
        {section.form_provider ? (
          <FormSlot provider={section.form_provider} formId={section.form_id} />
        ) : (
          image && (
            <div className="mx-auto max-w-[16rem] md:sticky md:top-10 md:max-w-[20rem]">
              <Image
                src={image}
                alt={`Portrait of ${hub.display_name}`}
                width={1000}
                height={1115}
                sizes="(min-width: 768px) 320px, 16rem"
                className="cover-shadow h-auto w-full rounded-[3px]"
              />
            </div>
          )
        )}
      </div>
      <div className={`max-w-[66ch] space-y-5 text-[1.0625rem] leading-[1.65] sm:text-lg ${section.form_provider ? "order-1" : ""}`}>
        {body.map((paragraph, index) => (
          <p key={index}>
              <RichParagraph text={paragraph} />
            </p>
        ))}
      </div>
    </main>
  );
}
