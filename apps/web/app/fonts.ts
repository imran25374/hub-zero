import localFont from "next/font/local";

// EB Garamond, self-hosted from @fontsource-variable/eb-garamond: the reading
// face for the whole site, in keeping with the books. Geist (sans) is kept for
// small interface text: navigation, buttons, footer.
export const garamond = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2",
      weight: "400 800",
      style: "italic",
    },
  ],
  variable: "--font-garamond",
  display: "swap",
});
