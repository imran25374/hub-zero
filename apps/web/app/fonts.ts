import localFont from "next/font/local";

// Libre Baskerville for headings and Libre Franklin for text, self-hosted from
// Fontsource so the build does not depend on fonts.googleapis.com. Chosen with
// the Monsoon theme on 23 Nov 2026 (decision log).
export const baskerville = localFont({
  src: [
    { path: "../node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-baskerville",
  display: "swap",
});

export const franklin = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../node_modules/@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-franklin",
  display: "swap",
});
