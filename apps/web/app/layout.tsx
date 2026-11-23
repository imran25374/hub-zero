import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";

import { baskerville, franklin } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Imran Naqvi", template: "%s | Imran Naqvi" },
};

export const viewport: Viewport = {
  themeColor: "#3f5a66",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${franklin.variable} ${baskerville.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#content"
          className="sr-only rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
