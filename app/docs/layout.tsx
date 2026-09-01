import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";

import { source } from "@/lib/source";

import "./docs.css";

/**
 * The documentation shell.
 *
 * `RootProvider` and the stylesheet are mounted here rather than in the root
 * layout, which is the whole trick: Next only ships a segment's CSS on that
 * segment's routes, so Tailwind's preflight and Fumadocs' theme reach /docs and
 * never touch the landing page's hand-written CSS.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      theme={{
        // The landing page is one fixed dark poster. Documentation is read for
        // a long time, in daylight as often as not, so it keeps a toggle and
        // opens on whatever the reader's system already prefers.
        defaultTheme: "dark",
        enableSystem: true,
      }}
    >
      <DocsLayout tree={source.pageTree} nav={{ title: <Brand /> }}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

function Brand() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.01em",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 2 3 12l9 10 9-10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 7 7 12l5 5 5-5Z" fill="currentColor" opacity="0.9" />
      </svg>
      FORGE
    </span>
  );
}
