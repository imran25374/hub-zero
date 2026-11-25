import Link from "next/link";

import { signOut } from "../actions";

/** The planner's sky band: what it is, and a way out. No session read here, so it renders at once. */
export default function DeskLayout({ children }: LayoutProps<"/planner">) {
  return (
    <>
      <header className="sky-band">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-8 gap-y-3 px-6 pt-8 pb-7">
          <div>
            <Link href="/planner" className="on-sky-title font-serif text-3xl font-bold text-on-sky no-underline sm:text-4xl">
              Planner
            </Link>
            <p className="on-sky-text mt-1.5 text-on-sky/95">What goes out on @studiotools.marketing, and when.</p>
          </div>
          <div className="on-sky-text flex items-center gap-5 text-sm font-semibold text-on-sky">
            <Link href="/" className="underline-offset-4 hover:underline">
              Site
            </Link>
            <form action={signOut}>
              <button type="submit" className="font-semibold underline-offset-4 hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:py-10">
        {children}
      </main>
    </>
  );
}
