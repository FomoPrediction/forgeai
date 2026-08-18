"use client";

import { log } from "../logger";
import { gsap, setupGsap } from "./gsap";

const snapLog = log.child("snap");

/** Sections in document order. Snapping steps one panel at a time between them. */
const SECTION_IDS = ["work", "vault", "atlas", "loop", "footer"] as const;

/**
 * Snapping only runs where every section is a full 100svh panel. Below this the
 * sections switch to `height: auto` (see globals.css) and snapping to their tops
 * would land mid-content.
 */
const DESKTOP = "(min-width: 981px)";

const SNAP_DURATION = 0.9;
/** Quiet gap with no input that re-arms the next snap. */
const SETTLE_MS = 140;
/** Hard ceiling on the post-snap lock so a steady mouse wheel can never stick. */
const MAX_LOCK_MS = 1200;
/** Accumulated distance that commits a snap. */
const WHEEL_COMMIT = 28;
const TOUCH_COMMIT = 52;
/** Layout settles late (fonts, video metadata); remeasure without thrashing. */
const REMEASURE_MS = 120;

type Stop = { id: string; y: number };

function readStops(): Stop[] {
  const top = window.scrollY;
  // A trailing section shorter than the viewport (the footer band) sits past the
  // document's last scrollable pixel. Clamp so its stop is actually reachable,
  // then drop any stop that collapses onto the one before it.
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const list: Stop[] = [];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const y = Math.min(Math.round(el.getBoundingClientRect().top + top), max);
    const prev = list[list.length - 1];
    if (prev && Math.abs(prev.y - y) < 8) continue;
    list.push({ id, y });
  }
  return list;
}

/** Wheel deltas arrive in pixels, lines, or pages depending on the device. */
function wheelDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 16;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== "function") return false;
  return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
}

export function bootSnap(): () => void {
  setupGsap();

  const desktop = window.matchMedia(DESKTOP);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let stops = readStops();
  let index = 0;
  let animating = false;

  // --- gesture gate --------------------------------------------------------
  let locked = false;
  let lockedAt = 0;
  let lastMag = 0;
  let accum = 0;
  let settleTimer = 0;
  let measureTimer = 0;
  let touchY = 0;
  let touchArmed = true;

  const rearm = (): void => {
    locked = false;
    accum = 0;
    lastMag = 0;
  };

  /** Any input pushes the quiet-gap deadline out. */
  const bump = (): void => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(rearm, SETTLE_MS);
  };

  const lock = (): void => {
    locked = true;
    lockedAt = performance.now();
    accum = 0;
    lastMag = Number.POSITIVE_INFINITY;
    bump();
  };

  /**
   * Decide whether a wheel event may start a new snap. Trackpad momentum arrives
   * as a long, monotonically decaying tail — a genuine new push spikes back up.
   * Unlock on that spike, on a quiet gap, or on a hard timeout so a steady mouse
   * wheel is never left stuck.
   */
  const gateOpen = (mag: number): boolean => {
    if (!locked) {
      lastMag = mag;
      return true;
    }
    if (performance.now() - lockedAt > MAX_LOCK_MS || mag > lastMag + 2) {
      rearm();
      lastMag = mag;
      return true;
    }
    lastMag = mag;
    return false;
  };

  // --- movement ------------------------------------------------------------
  const nearest = (y: number): number => {
    let best = 0;
    let bestGap = Number.POSITIVE_INFINITY;
    for (let i = 0; i < stops.length; i += 1) {
      const stop = stops[i];
      if (!stop) continue;
      const gap = Math.abs(stop.y - y);
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    return best;
  };

  const go = (next: number): void => {
    if (animating) return;
    const target = stops[next];
    if (!target) return;
    if (next === index && Math.abs(window.scrollY - target.y) < 2) return;

    index = next;
    animating = true;
    accum = 0;
    snapLog.info("snap", { to: target.id, y: target.y });

    // The tween lands exactly on target.y, so nothing hard-sets scroll on
    // completion — that trailing scrollTo was the visible jump at the end.
    const settle = (): void => {
      animating = false;
      lock();
    };

    gsap.to(window, {
      duration: reduced.matches ? 0.01 : SNAP_DURATION,
      ease: "power2.inOut",
      scrollTo: { y: target.y, autoKill: false },
      overwrite: "auto",
      onComplete: settle,
      onInterrupt: settle,
    });
  };

  const step = (dir: 1 | -1): void => go(index + dir);

  // --- input ---------------------------------------------------------------
  const onWheel = (e: WheelEvent): void => {
    if (!desktop.matches) return;
    // Trackpad pinch and ctrl+wheel arrive as wheel events; leave zoom alone.
    if (e.ctrlKey || e.metaKey) return;
    // Desktop owns the scroll outright. Never letting native scroll run is what
    // stops browser momentum from fighting the tween part-way through a section.
    e.preventDefault();
    bump();
    if (animating) return;

    const dy = wheelDelta(e);
    const mag = Math.abs(dy);
    if (mag < 1) return;
    if (!gateOpen(mag)) return;

    if (accum !== 0 && Math.sign(dy) !== Math.sign(accum)) accum = 0;
    accum += dy;
    if (Math.abs(accum) < WHEEL_COMMIT) return;

    step(accum > 0 ? 1 : -1);
  };

  const onTouchStart = (e: TouchEvent): void => {
    touchY = e.touches[0]?.clientY ?? 0;
    touchArmed = true;
    accum = 0;
  };

  const onTouchMove = (e: TouchEvent): void => {
    if (!desktop.matches) return;
    e.preventDefault();
    bump();
    if (animating || !touchArmed) return;

    const y = e.touches[0]?.clientY ?? touchY;
    const dy = touchY - y;
    touchY = y;
    if (Math.abs(dy) < 1) return;

    if (accum !== 0 && Math.sign(dy) !== Math.sign(accum)) accum = 0;
    accum += dy;
    if (Math.abs(accum) < TOUCH_COMMIT) return;

    // One snap per swipe; the next needs a fresh touchstart.
    touchArmed = false;
    step(accum > 0 ? 1 : -1);
  };

  const onKey = (e: KeyboardEvent): void => {
    if (!desktop.matches || isTyping(e.target)) return;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") next = index + 1;
    else if (e.key === "ArrowUp" || e.key === "PageUp") next = index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = stops.length - 1;
    if (next === null) return;
    e.preventDefault();
    rearm();
    go(next);
  };

  const onAnchor = (e: MouseEvent): void => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']");
    if (!(a instanceof HTMLAnchorElement)) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const i = stops.findIndex((s) => s.id === href.slice(1));
    if (i < 0) return;

    e.preventDefault();
    rearm();
    if (!desktop.matches) {
      const t = stops[i];
      index = i;
      if (t) window.scrollTo({ top: t.y, behavior: reduced.matches ? "auto" : "smooth" });
      return;
    }
    go(i);
  };

  // --- layout sync ---------------------------------------------------------
  const remeasure = (): void => {
    stops = readStops();
    if (animating) return;
    index = nearest(window.scrollY);
    const target = stops[index];
    if (desktop.matches && target && Math.abs(window.scrollY - target.y) > 1) {
      window.scrollTo(0, target.y);
    }
  };

  const queueRemeasure = (): void => {
    window.clearTimeout(measureTimer);
    measureTimer = window.setTimeout(remeasure, REMEASURE_MS);
  };

  /** Keep index honest when something else moves the page (custom scrollbar). */
  const onScroll = (): void => {
    if (animating) return;
    index = nearest(window.scrollY);
  };

  const onBreakpoint = (): void => {
    gsap.killTweensOf(window);
    animating = false;
    rearm();
    remeasure();
  };

  // --- boot ----------------------------------------------------------------
  const prevRestoration =
    "scrollRestoration" in window.history ? window.history.scrollRestoration : null;
  if (prevRestoration !== null) window.history.scrollRestoration = "manual";

  const fromHash = stops.findIndex((s) => s.id === window.location.hash.slice(1));
  index = fromHash >= 0 ? fromHash : 0;
  const start = stops[index];
  window.scrollTo(0, start ? start.y : 0);

  const firstMeasure = window.requestAnimationFrame(remeasure);
  const ro = new ResizeObserver(queueRemeasure);
  ro.observe(document.body);

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", queueRemeasure);
  desktop.addEventListener("change", onBreakpoint);
  document.addEventListener("click", onAnchor);
  snapLog.info("section snap live", { stops: stops.map((s) => s.id) });

  return () => {
    gsap.killTweensOf(window);
    window.cancelAnimationFrame(firstMeasure);
    window.clearTimeout(settleTimer);
    window.clearTimeout(measureTimer);
    ro.disconnect();
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", queueRemeasure);
    desktop.removeEventListener("change", onBreakpoint);
    document.removeEventListener("click", onAnchor);
    if (prevRestoration !== null) window.history.scrollRestoration = prevRestoration;
    snapLog.info("section snap dropped");
  };
}
