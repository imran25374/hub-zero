import type { Metadata } from "next";
import Link from "next/link";

import { SignInForm } from "@/components/planner/forms";

export const metadata: Metadata = { title: "Sign in" };

export default function PlannerSignInPage() {
  return (
    <>
      <header className="sky-band">
        <div className="mx-auto max-w-md px-6 pt-14 pb-10">
          <h1 className="on-sky-title font-serif text-3xl font-bold text-on-sky sm:text-4xl">Planner</h1>
          <p className="on-sky-text mt-2 text-on-sky/95">Sign in to review what goes out on Instagram.</p>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-md flex-1 px-6 py-10">
        <SignInForm />
        <p className="mt-6 text-sm text-muted-foreground">
          This page is for the site&apos;s owner.{" "}
          <Link href="/" className="text-foreground underline underline-offset-4">
            Go to the home page
          </Link>
        </p>
      </main>
    </>
  );
}
