import type { HubLink } from "@/lib/hub";

function actionLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (/(^|\.)amazon\./.test(host)) return "Buy on Amazon";
    return `Visit ${host}`;
  } catch {
    return "Open link";
  }
}

/**
 * The button for a link. It goes through /go/<id> so the click is counted, and
 * an affiliate link always shows its disclosure ("(paid link)") beside it.
 */
export function LinkAction({ link }: { link: HubLink }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans">
      <a
        href={`/go/${link.id}`}
        target="_blank"
        rel={link.is_affiliate ? "sponsored noopener" : "noopener"}
        className="inline-flex items-center rounded-[3px] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-horizon-glow"
      >
        {actionLabel(link.url)}
        <span className="sr-only">
          {" "}
          for {link.title} (opens in a new tab)
        </span>
      </a>
      {link.is_affiliate && link.disclosure_line && (
        <span className="text-sm text-muted-foreground">{link.disclosure_line}</span>
      )}
    </div>
  );
}
