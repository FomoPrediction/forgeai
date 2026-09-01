import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `next build` wipes and rewrites distDir. Pointing verification builds at a
  // separate directory keeps them from pulling chunks out from under a running
  // `next dev`. Unset in CI, so Vercel builds to the default `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /**
   * The documentation subdomain.
   *
   * One deployment serves both: a request whose host starts with `docs.` and
   * asks for `/` is rewritten to `/docs`, so docs.forgeai.com lands on the
   * documentation home while forgeai.com stays the landing page.
   *
   * Only the root is rewritten, deliberately. Rewriting `/:path*` to
   * `/docs/:path*` would look tidier in the address bar and would break every
   * link in the content, because Fumadocs generates them as `/docs/...` and
   * they would arrive as `/docs/docs/...`.
   *
   * The path works with or without the subdomain, so nothing here is required
   * for the site to function.
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "docs\\..*" }],
          destination: "/docs",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    return [
      {
        // Media is content-addressed by hand: filenames change when the cut
        // changes, so it can be cached hard at the edge.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Static chunks are already hashed by name, so a long immutable cache
        // is safe and saves a revalidation round trip on every docs page.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

/**
 * MDX, for the documentation only.
 *
 * The plugin compiles content/docs and leaves every other route alone, so the
 * landing page's build is unchanged.
 */
const withMDX = createMDX();

export default withMDX(nextConfig);
