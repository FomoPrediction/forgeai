import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `next build` wipes and rewrites distDir. Pointing verification builds at a
  // separate directory keeps them from pulling chunks out from under a running
  // `next dev`. Unset in CI, so Vercel builds to the default `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
    ];
  },
};

export default nextConfig;
