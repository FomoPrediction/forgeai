"use client";

import { useEffect, useRef } from "react";
import { loopBlock } from "../config";
import { log } from "../logger";
import { LoopApp } from "./LoopApp";

const loopUi = log.child("loop");

export function Loop() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const bar = document.querySelector(".bar");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) bar?.classList.add("is-light");
      },
      { threshold: 0.2 },
    );
    io.observe(section);
    loopUi.info("loop mounted");

    return () => io.disconnect();
  }, []);

  return (
    <section className="loop" id="loop" ref={sectionRef}>
      <div className="loop-inner">
        <header className="loop-head">
          <p className="atlas-pill">{loopBlock.pill}</p>
          <h2>{loopBlock.heading}</h2>
        </header>
        <div className="loop-stage">
          <LoopApp />
        </div>
      </div>
    </section>
  );
}
