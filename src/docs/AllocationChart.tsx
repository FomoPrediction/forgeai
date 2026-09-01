"use client";

import { useState } from "react";

import { ALLOCATIONS, TOTAL_SUPPLY, tokensFor } from "./tokenomics";

const W = 900;
const H = 520;
const CX = W / 2;
const CY = H / 2 + 6;
const R = 150;

/** Where a fraction of the circle lands, measured clockwise from noon. */
function at(fraction: number, radius: number) {
  const a = fraction * Math.PI * 2 - Math.PI / 2;
  return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius };
}

/**
 * Supply by allocation.
 *
 * A filled pie with the labels outside on leader lines, rather than a legend
 * beside a donut. Every slice carries its own name and number at the end of a
 * line, so identity never rests on matching a colour to a key, and the two
 * numbers a reader actually wants are the two largest things on the figure.
 *
 * Drawn rather than generated. The angles have to be the percentages, and an
 * image model asked for a pie renders a plausible-looking one with the wrong
 * wedges and mangled digits.
 *
 * The palette is the brand's own copper ramp with a single patina slice. A ramp
 * is not usually safe for categorical data, but every slice here is directly
 * labelled, which is the documented relief: nothing is identified by colour
 * alone.
 */
export function AllocationChart() {
  const [active, setActive] = useState<string | null>(null);

  let cursor = 0;
  const slices = ALLOCATIONS.map((a) => {
    const from = cursor;
    const to = (cursor += a.pct / 100);
    const mid = (from + to) / 2;

    const p1 = at(from, R);
    const p2 = at(to, R);
    const large = a.pct / 100 > 0.5 ? 1 : 0;

    // The leader: a dot on the arc, a short elbow outward, then a flat run to
    // the label. Right of centre reads left to right, left of centre mirrors.
    const anchor = at(mid, R);
    const elbow = at(mid, R + 34);
    const right = elbow.x >= CX;
    const endX = right ? elbow.x + 46 : elbow.x - 46;

    return {
      a,
      right,
      anchor,
      elbow,
      endX,
      d: `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${large} 1 ${p2.x} ${p2.y} Z`,
    };
  });

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="FORGE supply by allocation"
        onMouseLeave={() => setActive(null)}
      >
        <text
          x={44}
          y={54}
          className="fill-fd-foreground"
          style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 700 }}
        >
          FORGE token distribution
        </text>
        <text x={44} y={78} className="fill-fd-muted-foreground" fontSize="13">
          {(TOTAL_SUPPLY / 1_000_000_000).toFixed(0)} billion total supply
        </text>

        {slices.map(({ a, d }) => (
          <path
            key={a.id}
            d={d}
            fill={a.color}
            stroke="var(--color-fd-card)"
            strokeWidth="2"
            opacity={active && active !== a.id ? 0.35 : 1}
            style={{ transition: "opacity .18s" }}
            onMouseEnter={() => setActive(a.id)}
          />
        ))}

        {slices.map(({ a, right, anchor, elbow, endX }) => {
          const dim = active !== null && active !== a.id;
          return (
            <g
              key={a.id}
              opacity={dim ? 0.35 : 1}
              style={{ transition: "opacity .18s" }}
              onMouseEnter={() => setActive(a.id)}
            >
              <polyline
                points={`${anchor.x},${anchor.y} ${elbow.x},${elbow.y} ${endX},${elbow.y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-fd-muted-foreground"
              />
              <circle cx={anchor.x} cy={anchor.y} r="3.5" fill={a.color} />
              <text
                x={right ? endX + 8 : endX - 8}
                y={elbow.y - 1}
                textAnchor={right ? "start" : "end"}
                className="fill-fd-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 21,
                  fontWeight: 700,
                }}
              >
                {a.pct}%
              </text>
              <text
                x={right ? endX + 8 : endX - 8}
                y={elbow.y + 15}
                textAnchor={right ? "start" : "end"}
                className="fill-fd-muted-foreground"
                fontSize="12"
              >
                {a.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* The same numbers as text, because a figure is not a table and a reader
          who wants the token counts should not have to hover for them. */}
      <table className="w-full border-t border-fd-border text-[13px]">
        <tbody>
          {ALLOCATIONS.map((a) => (
            <tr
              key={a.id}
              onMouseEnter={() => setActive(a.id)}
              onMouseLeave={() => setActive(null)}
              className="border-b border-fd-border/60 last:border-0"
            >
              <td className="w-0 py-2 pl-4 pr-2">
                <span
                  className="block h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: a.color }}
                />
              </td>
              <td className="py-2 pr-3 text-fd-foreground">{a.name}</td>
              <td className="py-2 pr-3 text-right font-semibold tabular-nums text-fd-foreground">
                {a.pct}%
              </td>
              <td className="py-2 pr-4 text-right tabular-nums text-fd-muted-foreground">
                {(tokensFor(a.pct) / 1_000_000).toFixed(0)}M
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
