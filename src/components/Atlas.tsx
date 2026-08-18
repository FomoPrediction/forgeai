"use client";

import { useEffect, useRef } from "react";
import { atlasBlock } from "../config";
import { bootGlobe } from "../lib/globe";
import { log } from "../logger";

const atlasUi = log.child("atlas");

export function Atlas() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    const section = sectionRef.current;
    if (!canvas || !host || !section) return;
    const drop = bootGlobe(canvas, host);
    const bar = document.querySelector(".bar");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) bar?.classList.add("is-light");
      },
      { threshold: 0.2 },
    );
    io.observe(section);
    atlasUi.info("atlas mounted");
    return () => {
      drop();
      io.disconnect();
    };
  }, []);

  return (
    <section className="atlas" id="atlas" ref={sectionRef}>
      <div className="atlas-inner">
        <div className="atlas-copy">
          <p className="atlas-pill">{atlasBlock.pill}</p>
          <h2>
            <span>{atlasBlock.title[0]}</span>
            <span>{atlasBlock.title[1]}</span>
          </h2>
          <dl className="atlas-stats">
            {atlasBlock.stats.map((stat) => (
              <div className="atlas-stat" key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <div className="atlas-actions">
            <a className="launch hero-launch" href={atlasBlock.launch.href}>
              {atlasBlock.launch.label}
            </a>
            <a className="launch hero-launch launch--mute" href={atlasBlock.tasks.href}>
              {atlasBlock.tasks.label}
            </a>
          </div>
        </div>
        <div className="atlas-globe" ref={hostRef}>
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
