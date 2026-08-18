"use client";

import { useEffect, useRef } from "react";
import { floorCards } from "../config";
import { FloorVisual } from "./FloorVisual";
import { bootEarn } from "../lib/earn";
import { log } from "../logger";

const floorUi = log.child("floor");

export function EarnLoop() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const drop = bootEarn(section);
    floorUi.info("floor bento mounted");
    return drop;
  }, []);

  return (
    <section className="floor" id="vault" ref={sectionRef}>
      <div className="floor-inner">
        <header className="floor-head">
          <p className="floor-pill">Vault</p>
          <h2>
            Capital for working machines.
            <br />
            Yield drawn from the floor they run.
          </h2>
        </header>
        <div className="floor-grid">
          {floorCards.map((card) => (
            <article className={`floor-card floor-card--${card.span}`} key={card.id}>
              <div className="floor-card-copy">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
              <FloorVisual id={card.id} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
