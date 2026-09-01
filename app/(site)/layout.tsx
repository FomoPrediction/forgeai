import type { ReactNode } from "react";

import "../globals.css";

/**
 * The landing page's own stylesheet, scoped to the landing page.
 *
 * globals.css was imported by the root layout, so it shipped on every route
 * including /docs. It is 35KB of hand-written CSS for one poster, opening with
 * `*, *::before, *::after { margin: 0; padding: 0 }` and going on to style
 * `html`, `body` and every `a` on the page. None of that was written to sit
 * under a documentation framework.
 *
 * A route group moves it without changing a URL: this is still `/`.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return children;
}
