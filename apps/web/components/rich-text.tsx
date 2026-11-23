import Link from "next/link";

/**
 * Paragraph text from the database may carry links written as [label](url).
 * Nothing else is interpreted. A link to another site opens in a new tab.
 */
export function RichParagraph({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      href.startsWith("/") ? (
        <Link key={start} href={href} className="text-horizon underline-offset-4 hover:underline">
          {label}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener" className="text-horizon underline-offset-4 hover:underline">
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
