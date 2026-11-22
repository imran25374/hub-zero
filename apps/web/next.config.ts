import type { NextConfig } from "next";

// Images are served from this project's public Supabase Storage bucket.
const supabaseUrl = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; Next.js compiles them.
  transpilePackages: ["@workspace/ui", "@workspace/lib"],
  cacheComponents: true,
  // Partial Prefetching streams a 200 shell before a page can call notFound(), so
  // unknown or unpublished sections would not return a real 404. Our pages have no
  // request-time data, so it buys nothing here.
  partialPrefetching: false,
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol === "http:" ? "http" : "https",
            hostname: supabaseUrl.hostname,
            pathname: "/storage/v1/object/public/hub-media/**",
          },
        ]
      : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
