import { rangeMiles } from "@/data/abilities";
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
 */
export type Superlative = { label: string; value: string };

type Metric = {
  /** label when this bike holds it alone */
  label: string;
  dir: "min" | "max";
  pick: (b: Bike) => number | null;
  format: (b: Bike) => string;
};

const METRICS: Metric[] = [
  { label: "lightest", dir: "min", pick: (b) => b.n.wetKg, format: (b) => b.spec.wetWeight },
  { label: "heaviest", dir: "max", pick: (b) => b.n.wetKg, format: (b) => b.spec.wetWeight },
  { label: "biggest tank", dir: "max", pick: (b) => b.n.tankL, format: (b) => b.spec.tank },
  { label: "smallest tank", dir: "min", pick: (b) => b.n.tankL, format: (b) => b.spec.tank },
  { label: "longest range", dir: "max", pick: rangeMiles, format: (b) => `${rangeMiles(b)} mi` },
  { label: "shortest range", dir: "min", pick: rangeMiles, format: (b) => `${rangeMiles(b)} mi` },
  { label: "lowest seat", dir: "min", pick: (b) => b.n.seatMm, format: (b) => b.spec.seatHeight },
  { label: "tallest seat", dir: "max", pick: (b) => b.n.seatMm, format: (b) => b.spec.seatHeight },
  { label: "most clearance", dir: "max", pick: (b) => b.n.clearanceMm, format: (b) => b.spec.clearance },
  { label: "least clearance", dir: "min", pick: (b) => b.n.clearanceMm, format: (b) => b.spec.clearance },
  { label: "cheapest", dir: "min", pick: (b) => b.n.priceFrom, format: (b) => b.spec.price },
  { label: "dearest", dir: "max", pick: (b) => b.n.priceFrom, format: (b) => b.spec.price },
  // hours-based intervals are excluded rather than converted: the claim should
  // rest on a published figure, not on an assumed average speed
  { label: "longest service", dir: "max", pick: (b) => b.n.serviceMi, format: (b) => b.spec.serviceInterval },
  { label: "shortest service", dir: "min", pick: (b) => b.n.serviceMi, format: (b) => b.spec.serviceInterval },
  { label: "most power", dir: "max", pick: (b) => b.n.hp, format: (b) => b.spec.power },
  { label: "least power", dir: "min", pick: (b) => b.n.hp, format: (b) => b.spec.power },
  { label: "most torque", dir: "max", pick: (b) => b.n.nm, format: (b) => b.spec.torque },
  { label: "biggest engine", dir: "max", pick: (b) => b.n.cc, format: (b) => b.spec.engine },
  { label: "smallest engine", dir: "min", pick: (b) => b.n.cc, format: (b) => b.spec.engine },
];

/** slug -> the superlatives that bike holds. Built once, at module load. */
const TABLE: Record<string, Superlative[]> = (() => {
  const out: Record<string, Superlative[]> = {};
  for (const m of METRICS) {
    const scored = bikes
      .map((b) => ({ b, v: m.pick(b) }))
      .filter((x): x is { b: Bike; v: number } => x.v !== null);
    if (scored.length === 0) continue;
    const best = scored.reduce(
      (acc, x) => (m.dir === "max" ? Math.max(acc, x.v) : Math.min(acc, x.v)),
      scored[0].v,
    );
    const holders = scored.filter((x) => x.v === best);
    const label = holders.length > 1 ? `joint-${m.label}` : m.label;
    for (const { b } of holders) {
      (out[b.slug] ??= []).push({ label, value: m.format(b) });
    }
  }
  return out;
})();

export const superlativesFor = (bike: Bike): Superlative[] => TABLE[bike.slug] ?? [];
