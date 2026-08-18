# FORGE AI

Marketing site for FORGE — the capital layer for robotics and compute.

Built with Next.js (App Router), React 19 and TypeScript. No UI framework and no
CSS library: the whole site is one hand-written stylesheet plus GSAP for motion.

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

```bash
pnpm build    # production build
pnpm start    # serve the production build
pnpm typecheck
```

## Structure

```
app/
  layout.tsx      fonts, metadata, hero preloads
  page.tsx        renders <ForgeSite />
  globals.css     the entire stylesheet
  icon.tsx        generated favicon
  apple-icon.tsx  generated touch icon
src/
  config.ts       all copy and content, kept out of the components
  logger.ts       scoped logger, quiet in production
  components/     ForgeSite, EarnLoop, Atlas, Loop, LoopApp, Footer, ...
  lib/            imperative modules, each boot*(el) => teardown
public/media/     videos, poster frame, Rive file
```

Every module in `src/lib` follows the same contract — `boot*(element)` returns a
teardown function — and `ForgeSite` unwinds all of them in reverse on unmount.

## Sections

The page is five full-height panels driven by a custom snap controller
(`src/lib/snap.ts`). On desktop it owns the scroll outright, which is what keeps
transitions from fighting native scroll momentum.

1. `#work` — hero, with a cross-fading video reel
2. `#vault` — bento grid of animated SVG cards
3. `#atlas` — interactive globe (cobe)
4. `#loop` — "How it works", film inside a mock app frame
5. `#footer` — layered wordmark scene

Snapping is gated to `min-width: 981px`, matching the breakpoint where the
sections stop being full-height panels.

## Media

Videos are H.264, 720p, audio stripped, encoded with `-movflags +faststart` so
metadata is at the head of the file and `preload="metadata"` stays cheap.
`/media/*` is served with a one-year immutable cache header.

## Deploying

Deploys to Vercel with no configuration. Set the project root to this directory;
the build command and output are detected automatically.
