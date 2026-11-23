import Link from "next/link";

export function Notice({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-24">
      <h1 className="font-serif text-3xl sm:text-4xl">{title}</h1>
      <div className="mt-5 max-w-[34em] text-xl text-muted-foreground">{children}</div>
    </main>
  );
}

export function HomeLink() {
  return (
    <Link href="/" className="text-foreground underline underline-offset-4 hover:text-horizon">
      Go to the home page
    </Link>
  );
}
