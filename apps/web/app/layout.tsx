import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";

import { SiteFooter } from "@/components/site-footer";

import { garamond } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Imran Naqvi", template: "%s | Imran Naqvi" },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${garamond.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-serif text-foreground">
        <a
          href="#content"
          className="sr-only rounded-sm bg-primary px-4 py-2 font-sans text-sm text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
