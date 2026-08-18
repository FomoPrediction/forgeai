"use client";

import { heroClips, reelMotion } from "../config";
import { log } from "../logger";
import { gsap } from "./gsap";

const reelLog = log.child("reel");

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitReady(el: HTMLVideoElement, ms = 5000): Promise<void> {
  if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !el.error) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const onReady = (): void => {
      drop();
      resolve();
    };
    const onError = (): void => {
      drop();
      reject(new Error(`failed ${el.currentSrc || el.src}`));
    };
    const drop = (): void => {
      window.clearTimeout(tid);
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onError);
    };
    const tid = window.setTimeout(() => {
      drop();
      if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !el.error) resolve();
      else reject(new Error(`timeout ${el.src}`));
    }, ms);
    el.addEventListener("loadeddata", onReady, { once: true });
    el.addEventListener("canplay", onReady, { once: true });
    el.addEventListener("error", onError, { once: true });
  });
}

async function loadClip(el: HTMLVideoElement, src: string): Promise<void> {
  const same = el.getAttribute("data-src") === src;
  if (!same || el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || el.error) {
    el.setAttribute("data-src", src);
    el.src = src;
    el.load();
  }
  await waitReady(el);
  try {
    if (el.currentTime > 0.05) el.currentTime = 0;
  } catch {
    /* seeking can throw before metadata settles */
  }
}

function clipHold(duration: number): number {
  return Math.max(duration - reelMotion.fade - reelMotion.lead, 0.8);
}

async function safePlay(el: HTMLVideoElement): Promise<void> {
  try {
    await Promise.race([el.play(), wait(600)]);
  } catch {
    /* autoplay abort is fine; frames can still paint */
  }
}

export function bootReel(stage: HTMLElement): () => void {
  let cancelled = false;
  let timer = 0;

  const layers = [...stage.querySelectorAll<HTMLVideoElement>("[data-reel]")];
  const a = layers[0];
  const b = layers[1];
  if (!a || !b) {
    reelLog.error("need two video layers");
    return () => undefined;
  }

  let active = 0;
  let index = 0;
  let busy = false;

  const layer = (i: number): HTMLVideoElement => (i === 0 ? a : b);
  const clipAt = (i: number): (typeof heroClips)[number] =>
    heroClips[((i % heroClips.length) + heroClips.length) % heroClips.length]!;

  gsap.set(a, { opacity: 0, scale: reelMotion.toScale, zIndex: 1 });
  gsap.set(b, { opacity: 0, scale: reelMotion.fromScale, zIndex: 0 });

  const applyHold = (el: HTMLVideoElement): void => {
    const dur = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 4;
    el.playbackRate = 1;
    el.loop = clipHold(dur) > dur + 0.2;
  };

  const fade = (incoming: HTMLVideoElement, outgoing: HTMLVideoElement): Promise<void> =>
    new Promise((resolve) => {
      let done = false;
      const finish = (): void => {
        if (done) return;
        done = true;
        resolve();
      };
      gsap.set(incoming, { zIndex: 2 });
      gsap.set(outgoing, { zIndex: 1 });
      gsap
        .timeline({ onComplete: finish })
        .fromTo(
          incoming,
          { opacity: 0, scale: reelMotion.fromScale },
          {
            opacity: 1,
            scale: reelMotion.toScale,
            duration: reelMotion.fade,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          outgoing,
          {
            opacity: 0,
            scale: reelMotion.fromScale + 0.02,
            duration: reelMotion.fade,
            ease: "power2.inOut",
          },
          0,
        );
      window.setTimeout(finish, (reelMotion.fade + 0.25) * 1000);
    });

  const swap = async (): Promise<void> => {
    if (cancelled || busy) return;
    busy = true;
    const incoming = layer(1 - active);
    const outgoing = layer(active);
    const nextIndex = (index + 1) % heroClips.length;
    const clip = clipAt(nextIndex);
    outgoing.loop = false;
    let cut = false;

    try {
      await loadClip(incoming, clip.src);
      if (cancelled) return;
      applyHold(incoming);
      await safePlay(incoming);
      if (cancelled) return;
      await fade(incoming, outgoing);
      if (cancelled) return;
      outgoing.pause();
      gsap.set(outgoing, { zIndex: 0 });
      active = 1 - active;
      index = nextIndex;
      cut = true;
      reelLog.info("cut", { clip: clip.label, index });
      const prefetch = clipAt(index + 1);
      void loadClip(layer(1 - active), prefetch.src).catch((err) => {
        reelLog.warn("prefetch failed", err);
      });
    } catch (err) {
      reelLog.error("swap failed", err);
    } finally {
      busy = false;
      if (!cancelled) arm(cut ? undefined : 1200);
    }
  };

  const arm = (ms?: number): void => {
    if (cancelled) return;
    window.clearTimeout(timer);
    const cur = layer(active);
    const dur = Number.isFinite(cur.duration) && cur.duration > 0 ? cur.duration : 4;
    const waitMs = ms ?? clipHold(dur) * 1000;
    reelLog.info("hold armed", { clip: clipAt(index).label, waitMs });
    timer = window.setTimeout(() => {
      void swap();
    }, waitMs);
  };

  const first = clipAt(0);
  reelLog.info("warming first clip", { src: first.src });
  void (async () => {
    try {
      await loadClip(a, first.src);
      if (cancelled) return;
      applyHold(a);
      await safePlay(a);
      gsap.to(a, { opacity: 1, duration: 0.45, ease: "power2.out", zIndex: 2 });
      reelLog.info("reel live", { clip: first.label });
      void loadClip(b, clipAt(1).src).catch((err) => {
        reelLog.warn("prefetch failed", err);
      });
      arm();
    } catch (err) {
      reelLog.error("reel failed", err);
      await wait(400);
      if (!cancelled) arm(400);
    }
  })();

  return () => {
    cancelled = true;
    window.clearTimeout(timer);
    gsap.killTweensOf([a, b]);
    a.pause();
    b.pause();
    reelLog.info("reel stopped");
  };
}
