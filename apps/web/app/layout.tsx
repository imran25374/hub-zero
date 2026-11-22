import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "@workspace/ui/globals.css";

// Geist is self-hosted from the `geist` package, so builds never depend on Google Fonts.

export const metadata: Metadata = {
  title: "Imran Syed Naqvi",
  description: "Hub Zero: coming December 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
