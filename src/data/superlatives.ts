import { offroad, overall, rangeMiles } from "@/data/abilities";
import { type Bike, bikes } from "@/data/bikes";

/**
 * Superlatives computed from the data rather than written by hand.
 *
 * Hand-written "the only five-speed" and "second-largest tank" claims went stale
 * every single time a bike was added, and two were wrong the day they were typed.
 * Deriving them means a new bike cannot silently falsify an old row.
 *
 * Ties are detected, not assumed: two bikes really do share the longest service
 * interval, so the label says "joint-" rather than claiming it outright.
 *
 * Runners-up are included, because "second-most power" is as brittle to write by
 * hand as "most power" and just as useful to read. Ranking is competition-style:
 * two bikes tied for first are both first, and the value below them is third, so
 * it earns no chip. Nobody is quietly promoted by a tie above them.
 */
export type Superlative = {
  label: string;
  value: string;
  /** the metric this reads off, for callers that need to test it semantically */
  of: string;
  rank: 1 | 2 | 3;
  /** "list" ranks against every bike, "family" only against the same model's other years. */
  scope: "list" | "family";
};

type Metric = {
  /** label when this bike holds it alone */
  label: string;
  dir: "min" | "max";
  pick: (b: Bike) => number | null;
  format: (b: Bike) => string;
  /** which metric this reads off, so a max and its min count as one claim */
  of: string;
  /** how far down to rank. 2 by default; the overall standing goes to 3 for its medals. */
  depth?: number;
};

const ORDINAL = ["", "2nd-", "3rd-"];
const tenths = (v: number) => Math.round(v * 100) / 10;
const outOfTen = (v: number) => `${(v * 10).toFixed(1)}/10`;
/**
 * The overall standing ranks and prints at two decimals, unlike the axes.
 *
 * The axes are read off the chart, where a tenth is all the reader gets, so two
 * bikes shown as 5.0 should rank as joint. The overall standing is a podium: at
 * one decimal the 790 Adventure and the HP2 both round to 6.4 and tie for
 * silver, which leaves the medals reading gold, silver, silver and no bronze,
 * on a real gap of 0.055. Rank and display move together so a silver and a
 * bronze never show the same number.
 */
const hundredths = (v: number) => Math.round(v * 1000) / 100;
const outOfTenFine = (v: number) => `${(v * 10).toFixed(2)}/10`;

const METRICS: Metric[] = [
  {
    of: "weight",
    label: "lightest",
    dir: "min",
    pick: (b) => b.n.wetKg,
    format: (b) => b.spec.wetWeight,
  },
  {
    of: "weight",
    label: "heaviest",
    dir: "max",
    pick: (b) => b.n.wetKg,
    format: (b) => b.spec.wetWeight,
  },
  {
    of: "tank",
    label: "biggest tank",
    dir: "max",
    pick: (b) => b.n.tankL,
    format: (b) => b.spec.tank,
  },
  {
    of: "tank",
    label: "smallest tank",
    dir: "min",
    pick: (b) => b.n.tankL,
    format: (b) => b.spec.tank,
  },
  {
    of: "range",
    label: "longest range",
    dir: "max",
    pick: rangeMiles,
    format: (b) => `${rangeMiles(b)} mi`,
  },
  {
    of: "range",
    label: "shortest range",
    dir: "min",
    pick: rangeMiles,
    format: (b) => `${rangeMiles(b)} mi`,
  },
  {
    of: "seat",
    label: "lowest seat",
    dir: "min",
    pick: (b) => b.n.seatMm,
    format: (b) => b.spec.seatHeight,
  },
  {
    of: "seat",
    label: "tallest seat",
    dir: "max",
    pick: (b) => b.n.seatMm,
    format: (b) => b.spec.seatHeight,
  },
  {
    of: "clearance",
    label: "most clearance",
    dir: "max",
    pick: (b) => b.n.clearanceMm,
    format: (b) => b.spec.clearance,
  },
  {
    of: "clearance",
    label: "least clearance",
    dir: "min",
    pick: (b) => b.n.clearanceMm,
    format: (b) => b.spec.clearance,
  },
  {
    of: "price",
    label: "cheapest",
    dir: "min",
    pick: (b) => b.n.priceFrom,
    format: (b) => b.spec.price,
  },
  {
    of: "price",
    label: "dearest",
    dir: "max",
    pick: (b) => b.n.priceFrom,
    format: (b) => b.spec.price,
  },
  // hours-based intervals are excluded rather than converted: the claim should
  // rest on a published figure, not on an assumed average speed
  {
    of: "service",
    label: "longest service",
    dir: "max",
    pick: (b) => b.n.serviceMi,
    format: (b) => b.spec.serviceInterval,
  },
  {
    of: "service",
    label: "shortest service",
    dir: "min",
    pick: (b) => b.n.serviceMi,
    format: (b) => b.spec.serviceInterval,
  },
  // ranked on the rounded figure, so two bikes both shown as 5.0/10 read as joint
  // rather than being separated by a difference nothing on the page displays
  {
    of: "offroad",
    label: "easiest off road",
    dir: "max",
    pick: (b) => tenths(offroad(b)),
    format: (b) => outOfTen(offroad(b)),
  },
  {
    of: "offroad",
    label: "hardest off road",
    dir: "min",
    pick: (b) => tenths(offroad(b)),
    format: (b) => outOfTen(offroad(b)),
  },
  {
    of: "overall",
    depth: 3,
    label: "best overall",
    dir: "max",
    pick: (b) => hundredths(overall(b)),
    format: (b) => outOfTenFine(overall(b)),
  },
  {
    of: "gears",
    label: "fewest gears",
    dir: "min",
    pick: (b) => Number(b.spec.gears),
    format: (b) => b.spec.gears,
  },
  {
    of: "power",
    label: "most power",
    dir: "max",
    pick: (b) => b.n.hp,
    format: (b) => b.spec.power,
  },
  {
    of: "power",
    label: "least power",
    dir: "min",
    pick: (b) => b.n.hp,
    format: (b) => b.spec.power,
  },
  {
    of: "torque",
    label: "most torque",
    dir: "max",
    pick: (b) => b.n.nm,
    format: (b) => b.spec.torque,
  },
  {
    of: "engine",
    label: "biggest engine",
    dir: "max",
    pick: (b) => b.n.cc,
    format: (b) => b.spec.engine,
  },
  {
    of: "engine",
    label: "smallest engine",
    dir: "min",
    pick: (b) => b.n.cc,
    format: (b) => b.spec.engine,
  },
];

/**
 * Three 690s and three 701s are on this list purely to be told apart, and no
 * whole-list superlative does that: they are mid-field on everything. So each
 * model with more than one year here is also ranked against itself.
 *
 * Only these metrics, in this order, and only the best two per bike. Rank every
 * spec within a family and the 2018 690 collects five chips that all say the
 * same thing: it is the base model. Range is left out because within one model
 * it only ever restates the tank.
 */
/**
 * Price is deliberately absent. Within one model the newest year is always the
 * dearest and the oldest always the cheapest, so the claim carries no
 * information the year already gives you.
 */
const FAMILY_METRICS = ["weight", "seat", "tank", "service"];
const FAMILY_CAP = 2;

const familyKey = (b: Bike) => `${b.make} ${b.model}`;
const FAMILIES = (() => {
  const groups = new Map<string, Bike[]>();
  for (const b of bikes) groups.set(familyKey(b), [...(groups.get(familyKey(b)) ?? []), b]);
  return [...groups.values()].filter((g) => g.length > 1);
})();

/** slug -> the superlatives that bike holds. Built once, at module load. */
const TABLE: Record<string, Superlative[]> = (() => {
  const out: Record<string, Superlative[]> = {};
  /** what each bike already claims outright, so a family chip cannot repeat it */
  const held: Record<string, Set<string>> = {};

  const rank = (m: Metric, pool: { b: Bike; v: number }[], v: number) =>
    pool.filter((x) => (m.dir === "max" ? x.v > v : x.v < v)).length + 1;
  const score = (m: Metric, pool: Bike[]) =>
    pool.map((b) => ({ b, v: m.pick(b) })).filter((x): x is { b: Bike; v: number } => x.v !== null);

  for (const m of METRICS) {
    const scored = score(m, bikes);
    for (const { b, v } of scored) {
      const r = rank(m, scored, v);
      if (r > (m.depth ?? 2)) continue;
      const tied = scored.some((x) => x.b !== b && x.v === v);
      const label = [tied && "joint-", ORDINAL[r - 1], m.label].filter(Boolean).join("");
      (out[b.slug] ??= []).push({
        of: m.of,
        label,
        value: m.format(b),
        rank: r as 1 | 2 | 3,
        scope: "list",
      });
      (held[b.slug] ??= new Set()).add(m.of);
    }
  }

  for (const family of FAMILIES) {
    const taken: Record<string, number> = {};
    for (const of of FAMILY_METRICS) {
      for (const m of METRICS.filter((x) => x.of === of)) {
        const scored = score(m, family);
        // a figure every year shares says nothing about any one of them
        if (scored.length < 2 || new Set(scored.map((x) => x.v)).size === 1) continue;
        const winners = scored.filter((x) => rank(m, scored, x.v) === 1);
        if (winners.length > 1) continue;
        const { b } = winners[0];
        if (held[b.slug]?.has(m.of)) continue;
        if ((taken[b.slug] ?? 0) >= FAMILY_CAP) continue;
        taken[b.slug] = (taken[b.slug] ?? 0) + 1;
        (out[b.slug] ??= []).push({
          of: m.of,
          // not "of the 690 Enduro Rs": the chips render uppercase, and the
          // pluralising s then reads as part of the model name
          label: `${m.label} of any ${b.model}`,
          value: m.format(b),
          rank: 1,
          scope: "family",
        });
      }
    }
  }

  // the overall standing leads, then whole-list claims, then runners-up, then
  // the within-model ones
  const weight = (x: Superlative) => (x.of === "overall" ? 0 : x.scope === "family" ? 3 : x.rank);
  for (const list of Object.values(out)) list.sort((a, b) => weight(a) - weight(b));
  return out;
})();

export const superlativesFor = (bike: Bike): Superlative[] => TABLE[bike.slug] ?? [];

/**
 * 1, 2 or 3 for the top three chart areas, null otherwise. Reads the same table
 * the chips come from, so a crown and its chip can never disagree.
 */
export const overallRank = (bike: Bike): 1 | 2 | 3 | null =>
  superlativesFor(bike).find((s) => s.of === "overall")?.rank ?? null;

/** The medal holders, best first. */
export const overallPodium: Bike[] = bikes
  .filter((b) => overallRank(b) !== null)
  .sort((a, b) => (overallRank(a) as number) - (overallRank(b) as number));
