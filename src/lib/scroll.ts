"use client";

import { scroll as scrollConfig } from "../config";
import { log } from "../logger";
import { gsap, setupGsap } from "./gsap";

const scrollLog = log.child("scroll");

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export class ScrollChrome {
  private readonly track: HTMLElement;
  private readonly thumb: HTMLElement;
  private dragging = false;
  private dragOffset = 0;
  private ticking = false;
  private readonly onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.sync();
      this.ticking = false;
    });
  };
  private readonly onResize = (): void => this.sync();

  constructor(root: HTMLElement) {
    this.track = document.createElement("div");
    this.track.className = "scroll-track";
    this.track.setAttribute("aria-hidden", "true");

    this.thumb = document.createElement("div");
    this.thumb.className = "scroll-thumb";
    this.track.append(this.thumb);
    root.append(this.track);

    this.track.addEventListener("pointerdown", (e) => this.onTrackPointer(e));
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize);
    this.sync();
    scrollLog.info("custom scrollbar mounted");
  }

  destroy(): void {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    this.track.remove();
    scrollLog.info("custom scrollbar destroyed");
  }

  private metrics() {
    const view = window.innerHeight;
    const doc = Math.max(document.documentElement.scrollHeight, view);
    const maxScroll = Math.max(doc - view, 1);
    const track = this.track.clientHeight - scrollConfig.trackPad * 2;
    const thumb = clamp((view / doc) * track, scrollConfig.thumbMinPx, track);
    const travel = Math.max(track - thumb, 0);
    return { view, doc, maxScroll, track, thumb, travel };
  }

  private sync(): void {
    const m = this.metrics();
    const progress = clamp(window.scrollY / m.maxScroll, 0, 1);
    this.thumb.style.height = `${m.thumb}px`;
    this.thumb.style.transform = `translate3d(0, ${scrollConfig.trackPad + progress * m.travel}px, 0)`;
  }

  private onTrackPointer(e: PointerEvent): void {
    e.preventDefault();
    const m = this.metrics();
    const rect = this.track.getBoundingClientRect();
    const y = e.clientY - rect.top - scrollConfig.trackPad;
    const thumbTop = scrollConfig.trackPad + (window.scrollY / m.maxScroll) * m.travel;

    if (y < thumbTop || y > thumbTop + m.thumb) {
      const next = ((y - m.thumb / 2) / m.travel) * m.maxScroll;
      gsap.to(window, { scrollTo: { y: next, autoKill: true }, duration: 1, ease: "power2.inOut" });
    }

    this.dragging = true;
    this.dragOffset = y - thumbTop;
    this.track.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent): void => {
      if (!this.dragging) return;
      const local = ev.clientY - rect.top - scrollConfig.trackPad - this.dragOffset;
      const next = (local / m.travel) * m.maxScroll;
      window.scrollTo({ top: clamp(next, 0, m.maxScroll) });
    };

    const up = (): void => {
      this.dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }
}

export function bootScroll(root: HTMLElement): ScrollChrome {
  setupGsap();
  return new ScrollChrome(root);
}
