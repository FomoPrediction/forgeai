"use client";

import { useState } from "react";

import { ALLOCATIONS, UNLOCK_MONTHS, unlockedAt } from "./tokenomics";

const W = 640;
const H = 260;
const PAD = { top: 12, right: 8, bottom: 26, left: 40 };

const months = Array.from({ length: UNLOCK_MONTHS + 1 }, (_, i) => i);

/** Circulating share of total supply, per allocation, at a given month. */
function seriesAt(month: number) {
  return ALLOCATIONS.map((a) => (unlockedAt(a, month) * a.pct) / 100);
}

/**
 * What is circulating, month by month.
 *
 * A stacked area, because the question is two questions at once: how much is
 * out, and whose it is. Bands answer both; five separate lines would answer
 * only the second and leave the reader adding them up.
 *
 * Read from the same schedule the paragraphs are written from, so a cliff moved
 * in tokenomics.ts moves the picture and the prose together or neither.
 */
export function UnlockChart() {
  const [at, setAt] = useState<number | null>(null);

  const x = (m: number) =>
    PAD.left + (m / UNLOCK_MONTHS) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v) * (H - PAD.top - PAD.bottom);

  // Cumulative upper edge per series, so each band sits on the one below it.
  const bands = ALLOCATIONS.map((_, i) =>
    months.map((m) => {
      const s = seriesAt(m);
      return s.slice(0, i + 1).reduce((n, v) => n + v, 0);
    }),
  );

  const total = months.map((m) => seriesAt(m).reduce((n, v) => n + v, 0));
  const shown = at ?? UNLOCK_MONTHS;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        onMouseLeave={() => setAt(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const m = Math.round(
            ((px - PAD.left) / (W - PAD.left - PAD.right)) * UNLOCK_MONTHS,
          );
          setAt(Math.max(0, Math.min(UNLOCK_MONTHS, m)));
        }}
        role="img"
        aria-label="Circulating supply by month, stacked by allocation, over 48 months"
      >
        {/* Grid, recessive. Quarters of the supply. */}
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="rgba(243,234,220,0.10)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 3.5}
              textAnchor="end"
              fontSize="9.5"
              fill="#857e74"
            >
              {v * 100}%
            </text>
          </g>
        ))}

        {/* Bands, painted top down so the lower ones are not covered. A 1px
            stroke in the surface colour is the 2px gap between fills. */}
        {[...bands].reverse().map((band, ri) => {
          const i = bands.length - 1 - ri;
          const a = ALLOCATIONS[i]!;
          const d =
            `M ${x(0)} ${y(0)} ` +
            band.map((v, m) => `L ${x(m)} ${y(v)}`).join(" ") +
            ` L ${x(UNLOCK_MONTHS)} ${y(0)} Z`;
          return (
            <path
              key={a.id}
              d={d}
              fill={a.color}
              stroke="#0b0b0c"
              strokeWidth="1"
              opacity={0.95}
            />
          );
        })}

        {/* Year marks. Months are what the schedule is written in, so the axis
            is labelled in months and only the years are called out. */}
        {[0, 12, 24, 36, 48].map((m) => (
          <text
            key={m}
            x={x(m)}
            y={H - 8}
            textAnchor={m === 0 ? "start" : m === 48 ? "end" : "middle"}
            fontSize="9.5"
            fill="#857e74"
          >
            {m === 0 ? "Launch" : `Month ${m}`}
          </text>
        ))}

        {at !== null ? (
          <line
            x1={x(at)}
            x2={x(at)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="rgba(243,234,220,0.45)"
            strokeWidth="1"
          />
        ) : null}
      </svg>

      {/* The readout, always present. Without a pointer it shows the end state,
          which is the figure most people came for. */}
      <p
        style={{
          marginTop: 12,
          fontSize: 13,
          color: "#b6afa4",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <b style={{ color: "#f3eadc", fontWeight: 600 }}>
          {(total[shown]! * 100).toFixed(1)}%
        </b>{" "}
        circulating at {shown === 0 ? "launch" : `month ${shown}`}
        {at === null ? " · hover the chart to scrub" : ""}
      </p>
    </div>
  );
}
