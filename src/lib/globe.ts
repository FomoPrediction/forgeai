"use client";

import createGlobe from "cobe";
import { log } from "../logger";

const globeLog = log.child("globe");

const LAND: [number, number, number] = [0.81, 0.55, 0.34];
const GLOW: [number, number, number] = [243 / 255, 234 / 255, 220 / 255];
const SPIN = 0.002;
const DPR = 2;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function cssSize(host: HTMLElement): number {
  return Math.max(1, Math.round(host.getBoundingClientRect().width));
}

export function bootGlobe(canvas: HTMLCanvasElement, host: HTMLElement): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let phi = 2.6;
  let theta = 0.22;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let visible = true;
  let width = cssSize(host);
  let raf = 0;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${width}px`;

  const globe = createGlobe(canvas, {
    devicePixelRatio: DPR,
    width,
    height: width,
    phi,
    theta,
    dark: 0,
    diffuse: 1.6,
    scale: 1,
    mapSamples: 24000,
    mapBrightness: 4.4,
    mapBaseBrightness: 0.08,
    baseColor: LAND,
    markerColor: LAND,
    glowColor: GLOW,
    markers: [],
    context: {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    },
  });

  const size = (): void => {
    const next = cssSize(host);
    if (next === width) return;
    width = next;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${width}px`;
  };

  const frame = (): void => {
    if (!visible) {
      raf = 0;
      return;
    }
    if (!dragging && !reduced.matches) phi += SPIN;
    globe.update({ phi, theta, width, height: width });
    raf = window.requestAnimationFrame(frame);
  };

  const onDown = (e: PointerEvent): void => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("is-grabbing");
  };

  const onMove = (e: PointerEvent): void => {
    if (!dragging) return;
    phi += (e.clientX - lastX) / 190;
    theta = clamp(theta + (e.clientY - lastY) / 240, -0.52, 0.58);
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onUp = (): void => {
    dragging = false;
    canvas.classList.remove("is-grabbing");
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !raf) raf = window.requestAnimationFrame(frame);
    },
    { threshold: 0.05 },
  );
  io.observe(host);

  const ro = new ResizeObserver(() => size());
  ro.observe(host);

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  raf = window.requestAnimationFrame(frame);
  globeLog.info("atlas globe live", { width });

  return () => {
    window.cancelAnimationFrame(raf);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    ro.disconnect();
    io.disconnect();
    globe.destroy();
    globeLog.info("atlas globe dropped");
  };
}
