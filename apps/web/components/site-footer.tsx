// Fixed in code rather than the database: the Associates statement must be on
// every page whatever happens to the content.
export function SiteFooter() {
  return (
    <footer className="border-t border-border text-[0.8125rem] text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
        <a
          href="mailto:info@imransyednaqvi.com"
          className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          info@imransyednaqvi.com
        </a>
      </div>
    </footer>
  );
}
