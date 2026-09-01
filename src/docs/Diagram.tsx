import type { ReactNode } from "react";

/**
 * The diagram set the documentation draws with.
 *
 * COPPER, NOT A RAINBOW
 * These were built from the categorical chart palette, which put a green box
 * beside an orange one beside a blue one on a page whose product is copper on
 * near-black. A categorical palette exists to tell unrelated series apart in a
 * chart; the boxes in a flow are not series, they are steps in one thing, and
 * giving each a hue of its own said they were unrelated when the point is that
 * they are not.
 *
 * So the set is one accent, and depth is carried by surface and rule instead.
 * The silhouette is the app's notched corner, so a step here and a button in
 * the product are recognisably the same object.
 */

export const HUE = {
  copper: "#c4783a",
  ember: "#e8a35a",
  patina: "#2f8f80",
} as const;

export type Hue = keyof typeof HUE;

/* ── flow ─────────────────────────────────────────────────────────────────── */

export type FlowStep = { label: string; detail?: string };

export function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    <figure className="doc-fig my-8 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-stretch gap-2">
            <div className="doc-notch flex-1 border border-[var(--doc-line-strong)] bg-[var(--doc-panel-2)] p-3.5">
              <div className="flex items-center gap-2">
                {/* The step number, not a coloured dot. It says where in the
                    sequence this is, which a dot never did. */}
                <span className="doc-step-n">{i + 1}</span>
                <span className="text-[13px] font-semibold text-[var(--doc-ink)]">
                  {s.label}
                </span>
              </div>
              {s.detail ? (
                <p className="mt-1.5 text-[12px] leading-snug text-[var(--doc-dim)]">
                  {s.detail}
                </p>
              ) : null}
            </div>

            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="flex shrink-0 items-center justify-center self-center text-[var(--doc-copper)]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h9m0 0-3.2-3.2M12 8l-3.2 3.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hidden sm:block"
                  />
                  <path
                    d="M8 3v9m0 0-3.2-3.2M8 12l3.2-3.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:hidden"
                  />
                </svg>
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ── loop ─────────────────────────────────────────────────────────────────── */

export function Loop({
  nodes,
  caption,
}: {
  nodes: { label: string; detail: string }[];
  caption?: string;
}) {
  return (
    <figure className="doc-fig my-8 p-5">
      <ol className="doc-loop">
        {nodes.map((n, i) => (
          <li key={n.label}>
            <span className="doc-step-n">{i + 1}</span>
            <div className="min-w-0">
              <p className="doc-loop-t">{n.label}</p>
              <p className="doc-loop-d">{n.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-center gap-2 border-t border-[var(--doc-line)] pt-3 text-[12px] text-[var(--doc-dim)]">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M13 8a5 5 0 1 1-1.6-3.7M13 3v2.2h-2.2"
            stroke="var(--doc-copper)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {caption ?? "Back to the start."}
      </p>
    </figure>
  );
}

/* ── stat row ─────────────────────────────────────────────────────────────── */

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="not-prose my-7 grid gap-3 sm:grid-cols-3">
      {items.map((s) => (
        <div
          key={s.label}
          className="doc-notch border border-[var(--doc-line)] bg-[var(--doc-panel)] p-4"
        >
          <p className="text-[22px] font-bold leading-none tracking-[-0.01em] text-[var(--doc-ember)]">
            {s.value}
          </p>
          <p className="mt-2 text-[12.5px] leading-snug text-[var(--doc-dim)]">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── two column split ─────────────────────────────────────────────────────── */

export function Split({ children }: { children: ReactNode }) {
  return <div className="not-prose my-7 grid gap-3 sm:grid-cols-2">{children}</div>;
}

/**
 * One side of a pair.
 *
 * `hue` is kept in the signature so existing pages keep compiling, and is used
 * only to pick between the accent and its second: there is no third option, and
 * a side is never green.
 */
export function Side({
  title,
  hue = "copper",
  children,
}: {
  title: string;
  hue?: Hue;
  children: ReactNode;
}) {
  const c = hue === "patina" ? HUE.patina : HUE.copper;
  return (
    <div
      className="doc-notch border p-4"
      style={{
        borderColor: "var(--doc-line-strong)",
        background: `linear-gradient(180deg, ${c}14, transparent 70%)`,
      }}
    >
      <p
        className="text-[11px] font-bold uppercase tracking-[0.14em]"
        style={{ color: hue === "patina" ? HUE.patina : "var(--doc-ember)" }}
      >
        {title}
      </p>
      <div className="mt-2 text-[13px] leading-relaxed text-[var(--doc-dim)] [&>p+p]:mt-2">
        {children}
      </div>
    </div>
  );
}
