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
export function LinkAction({ link, compact = false }: { link: HubLink; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <a
        href={`/go/${link.id}`}
        target="_blank"
        rel={link.is_affiliate ? "sponsored noopener" : "noopener"}
        className={`inline-flex items-center rounded-[3px] bg-primary font-semibold text-primary-foreground transition-colors hover:bg-horizon-glow ${
          compact ? "min-h-10 px-4 text-[0.8125rem]" : "min-h-11 px-[18px] text-sm"
        }`}
      >
        {actionLabel(link.url)}
        <span className="sr-only">
          {" "}
          for {link.title} (opens in a new tab)
        </span>
      </a>
      {link.is_affiliate && link.disclosure_line && (
        <span className="text-xs text-muted-foreground">{link.disclosure_line}</span>
      )}
    </div>
  );
}
