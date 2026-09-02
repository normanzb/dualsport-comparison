import { type Bike, bikes } from "@/data/bikes";

/**
 * Ability axes for the radar chart.
 *
 * Two rules run the whole thing:
 *  - every axis is oriented so further out is better, which is why weight and seat
 *    height are inverted;
 *  - range and highway comfort are scored against absolute benchmarks, service,
 *    lightness and seat height against the other thirteen bikes. Range has a real
 *    absolute (a tank either takes you somewhere or it doesn't), so scaling it to
 *    the field would have made the Kove look perfect when it is merely the best of
 *    a short-legged group.
 */

/* ---------------------------------------------------------------------------
 * Real-world economy, miles per US gallon.
 *
 * Owner-reported figures (Fuelly) where a sample exists, otherwise a published
 * test or the manufacturer cycle figure. Tank size alone is not range: the
 * CRF300L carries half the Suzuki's fuel deficit and still goes further.
 * ------------------------------------------------------------------------- */
const MPG_US: Record<string, number> = {
  // Fuelly, 2021 model, 8 vehicles / 15,815 mi: 69.70
  "honda-crf300l": 70,
  // Fuelly WR125 (2010), 2 vehicles: 70.96. Yamaha claims 94.
  "yamaha-wr125r": 71,
  // No data for the 2025 DR-Z4S yet; DR-Z400S predecessor runs ~49.7
  "suzuki-drz4s": 50,
  // WMTC 6.2 L/100 km
  "kove-450-rally": 38,
  // Fuelly combined: 48.57
  "honda-crf450l": 49,
  // Reported ~38 mpg, ~80 mi from the 8.5 L tank
  "ktm-450-excf": 38,
  // No published economy yet; scored as its class peer, the 450 EXC-F
  "ducati-desmo450-eds": 38,
  // UK road tests: 52-53 imperial, so ~44 US
  "ccm-gp450": 44,
  // Fuelly by year, 47.7 to 55. Same LC4 single as the 701.
  "ktm-690-enduro-r-2018": 51,
  "ktm-690-enduro-r-2025": 51,
  "ktm-690-enduro-r-2026": 51,
  // Fuelly 2017, 5 vehicles / 17,145 mi: 47.57
  "husqvarna-701-enduro-2018": 48,
  "husqvarna-701-enduro-2025": 48,
  "husqvarna-701-enduro-2026": 48,
  // KTM claims 83 imperial mpg on the WMTC cycle; knobblies and real roads cost you
  "ktm-390-enduro-r": 60,
  "ktm-390-adventure-r": 62,
  // 293 single with a 21 L tank; makers claim 300+ miles, which lines up
  "rieju-aventura-rally-307": 58,
  // twin: CFMoto quote roughly 200 miles from 17.5 L
  "cfmoto-450mt": 44,
  "voge-300-rally": 65,
  // no owner data yet; scored as its class peer, the 450MT twin
  "moto-morini-alltrhike-450": 48,
  // 600 single, no owner sample; scored between the 450s and the 690
  "ajp-pr7": 55,
  // 1170 air-cooled boxer, and it drinks like one
  "bmw-hp2-enduro": 45,
  "yamaha-tenere-700": 55,
};

/* ---------------------------------------------------------------------------
 * Highway comfort inputs.
 *
 * Displacement comes off the bike itself. Wind protection is a judgement on a 0-5
 * scale, read off the bodywork: a rally tower with a screen shelters you, a number
 * plate does not. It is the one subjective number on the page.
 * ------------------------------------------------------------------------- */
/** 0 = bare number plate, 5 = full rally tower and screen */
const WIND: Record<string, number> = {
  "honda-crf300l": 1,
  "yamaha-wr125r": 1,
  "suzuki-drz4s": 1,
  "kove-450-rally": 5,
  "honda-crf450l": 0,
  "ktm-450-excf": 0,
  "ducati-desmo450-eds": 0,
  "ccm-gp450": 3,
  "ktm-690-enduro-r-2018": 1,
  "ktm-690-enduro-r-2025": 1,
  "ktm-690-enduro-r-2026": 1,
  "husqvarna-701-enduro-2018": 1,
  "husqvarna-701-enduro-2025": 1,
  "husqvarna-701-enduro-2026": 1,
  "ktm-390-enduro-r": 1,
  "ktm-390-adventure-r": 3,
  "rieju-aventura-rally-307": 4,
  "cfmoto-450mt": 3,
  "voge-300-rally": 3,
  "moto-morini-alltrhike-450": 3,
  "ajp-pr7": 3,
  "bmw-hp2-enduro": 1,
  "yamaha-tenere-700": 3,
};

/**
 * Top-gear comfort. Not min-max normalised: gearboxes here are only ever five or
 * six speeds, so scaling them to the field would make a single gear worth the
 * entire axis, more than a 112 cc displacement gap. A five-speed still has a top
 * gear, just a shorter one, worth maybe 10-15% more revs at speed.
 */
const GEAR_COMFORT: Record<number, number> = { 5: 0.75, 6: 1 };

// Derived, not hardcoded: a bike outside a fixed range would push a component
// past 1 and the index past 10, which is how a 1170 boxer once scored 10.2.
const CC_LO = Math.min(...bikes.map((b) => b.n.cc));
const CC_HI = Math.max(...bikes.map((b) => b.n.cc));
const WIND_HI = Math.max(...Object.values(WIND));

/**
 * Displacement on a log scale. The field spans 124 cc to 1170 cc, nearly ten to
 * one, so scaling it linearly crushes the small and mid-size bikes into the
 * bottom of the axis where most of them actually live. It also matches how the
 * motor feels: 125 to 400 is transformative, 700 to 1170 much less so.
 */
const engineScore = (cc: number) =>
  (Math.log(cc) - Math.log(CC_LO)) / (Math.log(CC_HI) - Math.log(CC_LO));

/**
 * Weights for the highway index. Engine sits above wind protection because at
 * equal weight a screen fully cancelled a 400 cc deficit, which let a 292 single
 * tie a 693. Named, and summed for the denominator, so the two cannot drift apart.
 */
const W_ENGINE = 4;
const W_WIND = 3;
const W_GEAR = 1;
const W_TOTAL = W_ENGINE + W_WIND + W_GEAR;

/**
 * How well the bike settles at road speed, 0 to 1. A tall sixth gear is little
 * help if the motor is a 125 and there is nothing to hide behind, but weather
 * protection cannot make up for an engine that is simply too small.
 */
export function highwayComfort(b: Bike): number {
  const gear = GEAR_COMFORT[Number(b.spec.gears)] ?? 1;
  const wind = WIND[b.slug] / WIND_HI;
  return (W_GEAR * gear + W_ENGINE * engineScore(b.n.cc) + W_WIND * wind) / W_TOTAL;
}

const L_PER_US_GAL = 3.785;

/** Usable range on one tank, in miles. */
export function rangeMiles(b: Bike): number {
  return Math.round((b.n.tankL / L_PER_US_GAL) * (MPG_US[b.slug] ?? 45));
}

export const mpgFor = (b: Bike) => MPG_US[b.slug] ?? 45;

/**
 * Full marks on the range axis. Nothing here reaches it, which is the point:
 * this is a class of short-legged bikes and the chart should say so.
 */
export const RANGE_FULL_MARKS = 500;

const span = (pick: (b: Bike) => number) => {
  const vs = bikes.map(pick);
  return { lo: Math.min(...vs), hi: Math.max(...vs) };
};
const unit = (v: number, r: { lo: number; hi: number }) =>
  r.hi === r.lo ? 1 : (v - r.lo) / (r.hi - r.lo);

const HP = span((b) => b.n.hp);
const NM = span((b) => b.n.nm);

/** Power and torque, weighted equally, against the rest of the field. */
export function performance(b: Bike): number {
  return (unit(b.n.hp, HP) + unit(b.n.nm, NM)) / 2;
}

/**
 * How low the bike carries its mass, 1 to 4. Not shown anywhere: it exists only
 * to feed the offroad index, because a bike that keeps its weight low is far
 * easier to handle off the tarmac than its kerb weight alone suggests.
 *
 * 1 is the norm. The LC4 690/701 sit at 2 for their underseat tank. The boxer
 * HP2 is 3: two cylinders lying flat put its mass low, though it is still a
 * 196 kg bike.
 */
const LOW_COG: Record<string, number> = {
  "bmw-hp2-enduro": 3,
  "husqvarna-701-enduro-2018": 2,
  "husqvarna-701-enduro-2025": 2,
  "husqvarna-701-enduro-2026": 2,
  "ktm-690-enduro-r-2018": 2,
  "ktm-690-enduro-r-2025": 2,
  "ktm-690-enduro-r-2026": 2,
};
const COG_BASE = 1;
/**
 * A fixed ceiling, not the observed maximum. Dividing by the maximum would make
 * the best bike here score 1.0 whatever its value, so lowering the HP2 from 4 to
 * 3 would have moved it not at all and merely lifted everything else. 4 is a
 * theoretical best that nothing on this list reaches.
 */
const COG_MAX = 4;
/** Scored absolutely, so the 1 that most bikes sit at is a baseline, not a zero. */
const cogScore = (slug: string) => Math.min(1, (LOW_COG[slug] ?? COG_BASE) / COG_MAX);

const WET = span((b) => b.n.wetKg);
const SEAT = span((b) => b.n.seatMm);
const CLEAR = span((b) => b.n.clearanceMm ?? 0);

/** Weights for the offroad index. Mass and clearance lead; the rest temper them. */
const W_LIGHT = 1;
const W_CLEAR = 1;
const W_COG = 0.5;
const W_SEAT = 0.3;
const W_OFFROAD = W_LIGHT + W_CLEAR + W_COG + W_SEAT;

/**
 * How readily the bike goes off the tarmac. Ease, not capability: a light bike
 * that carries its weight low and lets you reach the ground is easy to point at
 * a trail, which is a different question from how fast it gets down one.
 *
 * Rolling all three into one axis is what stops the chart double-counting. Wet
 * weight and clearance correlate at r = -0.75, so as separate spokes they would
 * swell the same lobe of the polygon for what is largely one trait. Seat height
 * is scored low-is-better, which is about reaching the ground rather than
 * capability, and is why it only gets 0.3: clearance already carries the
 * suspension-travel part of a tall seat.
 */
export function offroad(b: Bike): number {
  const light = 1 - unit(b.n.wetKg, WET);
  const clear = unit(b.n.clearanceMm ?? 0, CLEAR);
  const low = 1 - unit(b.n.seatMm, SEAT);
  const cog = cogScore(b.slug);
  return (W_LIGHT * light + W_CLEAR * clear + W_COG * cog + W_SEAT * low) / W_OFFROAD;
}

export type Axis = {
  key: string;
  label: string;
  /** raw value, already oriented so higher is better */
  value: (b: Bike) => number;
  display: (b: Bike) => string;
  /** absolute axes ignore the field and score against a fixed benchmark */
  absolute?: (b: Bike) => number;
};

/**
 * Hours-based intervals do not convert to mileage, so the chart assumes a 30 mph
 * working average purely to place them on the same axis. The table keeps hours.
 * The hours are read off the spec string, so a new hours-based bike needs no
 * change here.
 */
const MPH = 30;
const serviceMiles = (b: Bike) => {
  if (b.n.serviceMi !== null) return b.n.serviceMi;
  const hours = Number(b.spec.serviceInterval.match(/^(\d+)\s*hr$/)?.[1]);
  return Number.isFinite(hours) ? hours * MPH : 0;
};

export const AXES: Axis[] = [
  {
    key: "service",
    label: "Service",
    value: serviceMiles,
    display: (b) => b.spec.serviceInterval,
  },
  {
    key: "range",
    label: "Range",
    value: rangeMiles,
    display: (b) => `${rangeMiles(b)} mi`,
    absolute: (b) => rangeMiles(b) / RANGE_FULL_MARKS,
  },
  {
    key: "performance",
    label: "Performance",
    value: performance,
    display: (b) => `${(performance(b) * 10).toFixed(1)}/10`,
    absolute: performance,
  },
  {
    key: "offroad",
    label: "Offroad ease",
    value: offroad,
    display: (b) => `${(offroad(b) * 10).toFixed(1)}/10`,
    absolute: offroad,
  },
  {
    key: "highway",
    label: "Highway",
    value: highwayComfort,
    display: (b) => `${(highwayComfort(b) * 10).toFixed(1)}/10`,
    absolute: highwayComfort,
  },
];

const RANGES = Object.fromEntries(
  AXES.map((a) => {
    const vs = bikes.map(a.value);
    return [a.key, { lo: Math.min(...vs), hi: Math.max(...vs) }];
  }),
);

/** 0.06 floor so a worst-in-class axis still renders as a visible spoke. */
export function score(bike: Bike, axis: Axis) {
  if (axis.absolute) return Math.min(1, Math.max(0.06, axis.absolute(bike)));
  const { lo, hi } = RANGES[axis.key];
  if (hi === lo) return 1;
  return 0.06 + 0.94 * ((axis.value(bike) - lo) / (hi - lo));
}

/**
 * Overall standing: the area of the polygon the chart actually draws, as a
 * fraction of a full one, square-rooted so a bike scoring x on every axis reads
 * exactly x rather than x squared.
 *
 * Radar area depends on the order of the axes, because the same five scores
 * arranged differently enclose a different shape. Across all twelve distinct
 * orders the leader does not change, but its figure moves by about half a point,
 * so treat this as a summary of the chart as drawn rather than a law. It also
 * rewards all-rounders over specialists by construction: the best bike here off
 * road is nowhere near the top of it.
 */
export function overall(b: Bike): number {
  const r = AXES.map((a) => score(b, a));
  const paired = r.reduce((sum, v, i) => sum + v * r[(i + 1) % r.length], 0);
  return Math.sqrt(paired / r.length);
}
