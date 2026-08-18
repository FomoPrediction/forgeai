"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { loopApp, loopBlock } from "../config";

export function LoopApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  // User intent only, and deliberately not persisted — every fresh load starts
  // playing again, while a pause inside this session sticks until reload.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const film = filmRef.current;
    if (!film) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (inView && !paused && !reduced) {
      void film.play().catch(() => undefined);
    } else {
      film.pause();
    }
  }, [inView, paused]);

  return (
    <div className="app" ref={rootRef}>
      <div className="app-bar">
        <span className="app-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="app-mark" aria-hidden="true" />
        <span className="app-name">{loopApp.name}</span>
        {loopApp.pills.map((p) => (
          <span className="app-pill" key={p}>
            {p}
          </span>
        ))}
        <span className="app-status">{loopApp.status}</span>
        <span className="app-bar-end">
          <span className="app-zoom">
            <button type="button" aria-label="Zoom out">
              −
            </button>
            <b>{loopApp.zoom}</b>
            <button type="button" aria-label="Zoom in">
              +
            </button>
          </span>
          <button type="button" className="app-fit">
            {loopApp.fit}
          </button>
          <button
            type="button"
            className="app-go"
            aria-pressed={!paused}
            onClick={() => setPaused((p) => !p)}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true">
              {paused ? (
                <path d="M3 2 10 6 3 10z" />
              ) : (
                <path d="M3.4 2h2.1v8H3.4zM6.5 2h2.1v8H6.5z" />
              )}
            </svg>
            {paused ? "Play" : "Pause"}
          </button>
        </span>
      </div>

      <div className="app-scene">
        {loopApp.flows.map((flow) => (
          <span className="app-flow" key={flow.id}>
            {flow.steps.map((step, i) => (
              <Fragment key={step}>
                {i > 0 ? <i className="app-arrow" aria-hidden="true" /> : null}
                <b>{step}</b>
              </Fragment>
            ))}
          </span>
        ))}
        <span className="app-actions">
          {loopApp.actions.map((a) => (
            <a className="launch app-cta" href={a.href} key={a.id}>
              {a.label}
            </a>
          ))}
        </span>
      </div>

      <div className="app-canvas">
        <video
          ref={filmRef}
          className="app-film"
          src={loopBlock.film.src}
          poster={loopBlock.film.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
