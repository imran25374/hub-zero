import { LinkAction } from "@/components/link-action";
import { groupLinks, type HubSection } from "@/lib/hub";

/**
 * A plain grouped list of links. Stands in for the Dashboard, Portfolio Mosaic
 * and Classic Stack layouts until they are designed (Stage 3).
 */
export function LinkList({ section }: { section: HubSection }) {
  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 md:py-20">
      <h1 className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-medium">{section.title}</h1>
      {section.description && (
        <p className="mt-5 max-w-[34em] text-2xl leading-snug text-muted-foreground">{section.description}</p>
      )}
      {groupLinks(section.links).map((group, index) => (
        <section key={group.label ?? index} className="mt-14">
          {group.label && <h2 className="font-serif text-2xl italic">{group.label}</h2>}
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {group.links.map((link) => (
              <li key={link.id} className="grid gap-4 py-6 md:grid-cols-[minmax(0,2fr)_auto] md:items-center">
                <div>
                  <h3 className="font-serif text-2xl">{link.title}</h3>
                  {link.subtitle && <p className="mt-1 text-muted-foreground italic">{link.subtitle}</p>}
                  {link.description && <p className="mt-2 max-w-[38em] text-lg">{link.description}</p>}
                </div>
                <LinkAction link={link} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
