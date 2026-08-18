"use client";

import { log } from "../logger";

const earnLog = log.child("earn");

export function bootEarn(section: HTMLElement): () => void {
  const bar = document.querySelector(".bar");
  const desktop = window.matchMedia("(min-width: 901px)");
  let raf = 0;

  const paintBar = (light: boolean): void => {
    bar?.classList.toggle("is-light", light);
  };

  const tick = (): void => {
    raf = 0;
    paintBar(section.getBoundingClientRect().top < window.innerHeight * 0.35);
  };

  const onScroll = (): void => {
    if (!raf) raf = window.requestAnimationFrame(tick);
  };

  tick();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  desktop.addEventListener("change", onScroll);
  earnLog.info("floor chrome live");

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    desktop.removeEventListener("change", onScroll);
    if (raf) window.cancelAnimationFrame(raf);
    paintBar(false);
    earnLog.info("floor chrome dropped");
  };
}
