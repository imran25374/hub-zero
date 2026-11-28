import type { HubLink } from "@/lib/hub";

function actionLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (/(^|\.)amazon\./.test(host)) {
      // Amazon's add-to-cart link (ASIN.1, ASIN.2, …): Amazon asks the buyer to confirm first.
      if (parsed.pathname.includes("/cart/add")) {
        const items = [...parsed.searchParams.keys()].filter((key) => /^ASIN\.\d+$/i.test(key)).length;
        return items > 1 ? `Add all ${items} to Amazon cart` : "Add to Amazon cart";
      }
      return "Buy on Amazon";
    }
    if (/\.pdf$/i.test(parsed.pathname)) return "Download the PDF";
    return `Visit ${host}`;
  } catch {
    return "Open link";
  }
}

/**
 * The button for a link. It goes through /go/<id> so the click is counted, and
 * an affiliate link always shows its disclosure ("(paid link)") beside it.
 * The outline variant is for a second, quieter button beside a main one.
 */
export function LinkAction({
  link,
  compact = false,
  variant = "solid",
}: {
  link: HubLink;
  compact?: boolean;
  variant?: "solid" | "outline";
}) {
  const look =
    variant === "outline"
      ? "border border-primary text-primary hover:bg-secondary"
      : "bg-primary text-primary-foreground hover:bg-horizon-glow";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <a
        href={`/go/${link.id}`}
        target="_blank"
        rel={link.is_affiliate ? "sponsored noopener" : "noopener"}
        className={`inline-flex items-center rounded-[3px] font-semibold transition-colors ${look} ${
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
