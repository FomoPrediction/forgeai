"use client";

import { useLayoutEffect, useRef } from "react";
import { heroClips, hudCta, hudPins } from "../config";
import { gsap, setupGsap } from "../lib/gsap";
import { bootReel } from "../lib/reel";
import { bootScroll } from "../lib/scroll";
import { bootSnap } from "../lib/snap";
import { log } from "../logger";
import { Atlas } from "./Atlas";
import { EarnLoop } from "./EarnLoop";
import { Footer } from "./Footer";
import { Loop } from "./Loop";

const uiLog = log.child("ui");

function hudPath(pts: readonly (readonly [number, number])[] | undefined): string {
  if (!pts?.length) return "";
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
}

function origin(pts: readonly (readonly [number, number])[] | undefined): { x: number; y: number } {
  const p = pts?.[0];
  return p ? { x: p[0], y: p[1] } : { x: 0, y: 0 };
}

function pinHud(root: HTMLElement): void {
  const hud = root.querySelector<HTMLElement>(".hud");
  if (!hud) return;
  const box = hud.getBoundingClientRect();
  for (const btn of hud.querySelectorAll<HTMLElement>(".hud-pin")) {
    const line = hud.querySelector<SVGPathElement>(
      `[data-hud="${btn.dataset.pin}"] .hud-line`,
    );
    if (!line) continue;
    const ctm = line.getScreenCTM();
    if (!ctm) continue;
    const end = line.getPointAtLength(line.getTotalLength());
    btn.style.left = `${ctm.a * end.x + ctm.c * end.y + ctm.e - box.left}px`;
    btn.style.top = `${ctm.b * end.x + ctm.d * end.y + ctm.f - box.top}px`;
  }
}

function playIntro(root: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    pinHud(root);
    const lines = [...root.querySelectorAll<SVGPathElement>(".hud-line")];
    for (const line of lines) {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    }
    gsap.set(".bar", { y: -14, opacity: 0 });
    gsap.set(".hero-copy", { y: 22, opacity: 0 });
    gsap.set(".tick", { y: 16, opacity: 0 });
    gsap.set(".giant", { opacity: 0 });
    gsap.set(".hud", { opacity: 1 });
    gsap.set(".hud-dot, .hud-schematic, .hud-pin", { opacity: 0 });

    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(".bar", { y: 0, opacity: 1, duration: 0.55 })
      .to(".hero-copy", { y: 0, opacity: 1, duration: 0.75 }, "-=0.15")
      .to(".tick", { y: 0, opacity: 1, duration: 0.5 }, "-=0.45")
      .to(".giant", { opacity: 1, duration: 1.1 }, "-=0.8")
      .to(".hud-schematic", { opacity: 1, duration: 1.1 }, "-=0.9")
      .to(
        ".hud-line",
        { strokeDashoffset: 0, duration: 0.85, stagger: 0.14, ease: "power2.inOut" },
        "-=0.85",
      )
      .to(".hud-dot", { opacity: 1, duration: 0.25, stagger: 0.14 }, "-=0.7")
      .to(".hud-pin", { opacity: 1, duration: 0.35, stagger: 0.14 }, "-=0.55");
    uiLog.info("hero intro timeline played");
  }, root);
  return () => ctx.revert();
}

export function ForgeSite() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    setupGsap();
    pinHud(root);
    const pinAgain = window.requestAnimationFrame(() => pinHud(root));
    const chrome = bootScroll(root);
    const dropSnap = bootSnap();
    const dropIntro = playIntro(root);
    const dropReel = bootReel(stage);
    const onResize = (): void => pinHud(root);
    window.addEventListener("resize", onResize);
    uiLog.info("forge site mounted");

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(pinAgain);
      dropIntro();
      dropReel();
      dropSnap();
      chrome.destroy();
      uiLog.info("forge site unmounted");
    };
  }, []);

  const ctaHref = hudCta.href || "#";

  return (
    <div className="site is-boot" ref={rootRef}>
      <header className="bar">
        <a className="logo" href="/">
          <i className="glyph" aria-hidden="true" />
          FORGE AI
        </a>
        <nav className="nav">
          <a href="#work">Protocol</a>
          <a href="#vault">Vault</a>
          <a href="#atlas">Atlas</a>
          <a href="#loop">Loop</a>
        </nav>
        <a className="launch" href="#vault">
          Launch
        </a>
      </header>
      <main>
        <section className="stage" id="work" ref={stageRef}>
          <div className="reel">
            <video
              data-reel="0"
              src={heroClips[0].src}
              muted
              playsInline
              preload="auto"
              poster="/media/poster.jpg"
            />
            <video
              data-reel="1"
              src={heroClips[1].src}
              muted
              playsInline
              preload="auto"
            />
          </div>
          <div className="grade-cu" />
          <div className="grade" />
          <div className="hud">
            <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
              <g className="hud-schematic" fill="none" aria-hidden="true">
                <circle cx="700" cy="640" r="92" />
                <rect x="430" y="560" width="240" height="170" />
              </g>
              <g className="hud-mark" data-hud="cta">
                <path className="hud-line" d={hudPath(hudCta.path)} />
                <circle className="hud-dot" cx={origin(hudCta.path).x} cy={origin(hudCta.path).y} r="3.5" />
              </g>
              {hudPins.map((p) => {
                const o = origin(p.path);
                return (
                  <g className="hud-mark" data-hud={p.id} key={p.id}>
                    <path className="hud-line" d={hudPath(p.path)} />
                    <circle className="hud-dot" cx={o.x} cy={o.y} r="3.5" />
                  </g>
                );
              })}
            </svg>
            <a
              className="hud-cosmic hud-pin"
              data-pin="cta"
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hudCta.label}
            </a>
            {hudPins.map((p) => (
              <a
                className="hud-cosmic hud-pin"
                data-pin={p.id}
                href={p.href || "#"}
                key={p.id}
                {...(p.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {p.label}
              </a>
            ))}
          </div>
          <div className="giant">FORGE</div>
          <div className="hero-copy">
            <h1>
              The capital foundry
              <br />
              for working machines.
            </h1>
            <p>
              We are building the capital layer for robotics and compute. Powered by
              staked tokenized assets. GPUs, robot cells, and training data compounding
              in one loop.
            </p>
            <a className="launch hero-launch" href="#vault">
              Launch App
            </a>
          </div>
          <div className="tick">
            <b>8.14%</b>
            <span>Prime target · 24h tick</span>
          </div>
        </section>
        <EarnLoop />
        <Atlas />
        <Loop />
      </main>
      <Footer />
    </div>
  );
}
