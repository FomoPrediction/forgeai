"use client";

import { useEffect, useRef } from "react";
import { footerBlock } from "../config";
import { gsap, setupGsap } from "../lib/gsap";
import { log } from "../logger";

const footUi = log.child("footer");

/**
 * Layered scene, stacked by z-index inside the footer's own context:
 *   0  ember glow rising off the floor of the forge
 *   1  giant FORGE wordmark, set into the dark
 *   2  grain + veil so the content band stays readable
 *   3  content band (contact / CTAs / links / legal)
 */
export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    setupGsap();
    const bar = document.querySelector(".bar");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let shown = false;

    const ctx = gsap.context(() => {
      const hide = (): void => {
        gsap.set("[data-foot-word]", { y: 60, opacity: 0 });
        gsap.set("[data-foot-col]", { y: 30, opacity: 0 });
      };

      const play = (): void => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            "[data-foot-word]",
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4 },
            0,
          )
          .fromTo(
            "[data-foot-col]",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 },
            0.4,
          );
      };

      if (reduced.matches) {
        gsap.set("[data-foot-word], [data-foot-col]", { y: 0, opacity: 1 });
      } else {
        hide();
      }

      const io = new IntersectionObserver(
        (entries) => {
          const ratio = entries[0]?.intersectionRatio ?? 0;
          // The footer is dark; the bar must drop its light treatment here.
          bar?.classList.toggle("is-light", ratio < 0.3);
          if (reduced.matches) return;
          if (ratio >= 0.35 && !shown) {
            shown = true;
            play();
          } else if (ratio <= 0.1 && shown) {
            shown = false;
            hide();
          }
        },
        { threshold: [0, 0.1, 0.35, 1] },
      );
      io.observe(section);
      footUi.info("footer mounted");

      return () => io.disconnect();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="foot" id="footer" ref={sectionRef}>
      <div className="foot-glow" aria-hidden="true" />

      <div className="foot-word" data-foot-word aria-hidden="true">
        <span>{footerBlock.wordmark}</span>
      </div>

      <div className="foot-grain" aria-hidden="true" />
      <div className="foot-veil" aria-hidden="true" />

      <div className="foot-inner">
        <div className="foot-grid">
          <div className="foot-col" data-foot-col>
            <h3>{footerBlock.contact.label}</h3>
            <ul className="foot-list">
              <li>
                <a href={`mailto:${footerBlock.contact.email}`}>
                  {footerBlock.contact.email}
                </a>
              </li>
              <li className="foot-quiet">{footerBlock.contact.line}</li>
            </ul>
            <div className="foot-socials">
              {footerBlock.socials.map((s) => (
                <a href={s.href} key={s.label} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="foot-cta" data-foot-col>
            <div className="foot-cta-row">
              {footerBlock.ctas.map((c) => (
                <a
                  className={`launch hero-launch${c.primary ? "" : " launch--mute"}`}
                  href={c.href}
                  key={c.label}
                >
                  {c.label}
                </a>
              ))}
            </div>
            <p className="foot-note">{footerBlock.note}</p>
          </div>

          <div className="foot-links" data-foot-col>
            {footerBlock.columns.map((col) => (
              <div key={col.title}>
                <h3>{col.title}</h3>
                <ul className="foot-list">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="foot-legal" data-foot-col>
          {footerBlock.legal.map((l) => (
            <a href={l.href} key={l.label}>
              {l.label}
            </a>
          ))}
          <span className="foot-copy" suppressHydrationWarning>
            © {new Date().getFullYear()} {footerBlock.owner}
          </span>
        </div>
      </div>
    </footer>
  );
}
