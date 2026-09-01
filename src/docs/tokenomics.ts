/**
 * FORGE supply and allocation.
 *
 * One file, because every figure on the tokenomics page is derived from it. A
 * percentage written into a paragraph and a percentage drawn in a chart will
 * disagree the first time somebody edits one of them.
 *
 * The colours are the categorical set validated for the dark chart surface:
 * worst adjacent CVD Delta E 9.4, normal-vision 19.7, all five clear 3:1 on
 * #0b0b0c. Slot order is the allocation order.
 */

export const TOTAL_SUPPLY = 1_000_000_000;

export type Allocation = {
  id: string;
  name: string;
  pct: number;
  color: string;
  /** What the tokens are for. One sentence. */
  purpose: string;
  /** When they move. Plain months. */
  unlock: string;
  /** Month the first token can move, for the unlock chart. */
  cliffMonths: number;
  /** Share released at the cliff, 0 to 1. */
  atCliff: number;
  /** Months the remainder streams over, after the cliff. */
  streamMonths: number;
};

export const ALLOCATIONS: Allocation[] = [
  {
    id: "future",
    name: "Future rewards",
    pct: 30,
    color: "#c4783a",
    purpose:
      "Held for contributor seasons after the first, released against work verified onchain.",
    unlock:
      "No cliff and no fixed schedule. A season opens, work is done, the season closes, and its pool converts.",
    cliffMonths: 0,
    atCliff: 0,
    streamMonths: 42,
  },
  {
    id: "airdrop",
    name: "Airdrop",
    pct: 20,
    color: "#e8a35a",
    purpose:
      "The first distribution to contributors, against Copper earned before launch.",
    unlock: "Claimable from launch, on the terms published when the season closes.",
    cliffMonths: 0,
    atCliff: 1,
    streamMonths: 1,
  },
  {
    id: "investors",
    name: "Investors",
    pct: 15,
    color: "#8a4e24",
    purpose:
      "Early backers who funded the contracts, the fleet and the first season before there was revenue.",
    unlock:
      "Nothing for 12 months. A quarter at month 12, then equal monthly amounts across the following 24 months.",
    cliffMonths: 12,
    atCliff: 0.25,
    streamMonths: 24,
  },
  {
    id: "treasury",
    name: "Treasury and liquidity",
    pct: 15,
    color: "#2f8f80",
    purpose:
      "Exchange liquidity at launch, then grants, audits and integrations that governance votes to fund.",
    unlock: "A fifth at launch for liquidity. The rest streams over 48 months.",
    cliffMonths: 0,
    atCliff: 0.2,
    streamMonths: 48,
  },
  {
    id: "depositors",
    name: "Depositors",
    pct: 10,
    color: "#f6d8a8",
    purpose:
      "Paid to the people who staked assets and kept the pool funded while the fleet was built.",
    unlock: "Accrues while staked and is claimable in the season it was earned.",
    cliffMonths: 0,
    atCliff: 0.2,
    streamMonths: 24,
  },
  {
    id: "team",
    name: "Team and ecosystem",
    pct: 10,
    color: "#6b5a4a",
    purpose:
      "The people building and running the protocol, plus the programmes that start new task tracks.",
    unlock:
      "Nothing for 12 months. A quarter at month 12, then equal monthly amounts across the following 36 months.",
    cliffMonths: 12,
    atCliff: 0.25,
    streamMonths: 36,
  },
];

export const tokensFor = (pct: number) => Math.round((TOTAL_SUPPLY * pct) / 100);

/** Sanity: the split has to be a whole. Caught at import, not in review. */
const SUM = ALLOCATIONS.reduce((n, a) => n + a.pct, 0);
if (Math.abs(SUM - 100) > 0.001) {
  throw new Error(`Allocations total ${SUM}%, not 100%`);
}

/**
 * Circulating share by month, per allocation.
 *
 * Computed rather than drawn, so a change to a cliff moves the chart and the
 * prose together or neither.
 */
export function unlockedAt(a: Allocation, month: number): number {
  if (month < a.cliffMonths) return 0;
  const after = month - a.cliffMonths;
  if (after === 0) return a.atCliff;
  const streamed = Math.min(1, after / a.streamMonths) * (1 - a.atCliff);
  return Math.min(1, a.atCliff + streamed);
}

export const UNLOCK_MONTHS = 48;
