import { type Bike, bikes } from "@/data/bikes";

/**
 * Ability axes for the radar chart.
 *
 * Two rules run the whole thing:
 *  - every axis is oriented so further out is better, which is why weight and seat
 *    height are inverted;
 *  - every axis scores against a fixed benchmark, never against the rest of the
 *    field. Scaling to the field makes the best bike on an axis score full marks
 *    however good it actually is, which flattered the Kove's range and handed the
 *    service axis to whoever printed the longest interval.
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
  // Fuelly CRF300 Rally, same 286 single as the L with more bodywork to push
  "honda-crf300-rally": 66,
  // Fuelly Tenere 700, 60+ vehicles: ~52. The variants share the CP2 twin.
  "yamaha-tenere-700-rally": 52,
  "yamaha-tenere-700-world-raid": 52,
  // Fuelly LC8c 790/890 adventure twins: high 40s
  "ktm-790-adventure": 48,
  "ktm-890-adventure-r": 46,
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
  "yamaha-tenere-700-rally": 3,
  "yamaha-tenere-700-world-raid": 4,
  "honda-crf300-rally": 3,
  "ktm-790-adventure": 4,
  "ktm-890-adventure-r": 3,
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
  // WIND has no entry for a bike until someone judges it; falling through to
  // undefined turned the whole index into NaN, so a new bike scores mid-scale
  // and is obvious on the chart rather than silently poisoning it.
  const wind = (WIND[b.slug] ?? WIND_HI / 2) / WIND_HI;
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

/**
 * Full-rate credit up to the knee, then a much shallower slope to the ceiling.
 *
 * Used wherever more of something stops mattering past a point. It never docks
 * the leader, which still reaches 1: it stops the gap between "enough" and "more
 * than enough" being worth as much as the gap between "little" and "enough".
 */
const kneeScore = (v: number, knee: number, ceiling: number, atKnee: number) => {
  if (v <= knee) return atKnee * (v / knee);
  if (ceiling <= knee) return 1;
  return atKnee + (1 - atKnee) * ((v - knee) / (ceiling - knee));
};

/**
 * Performance is power and torque per kilogram, not power and torque.
 *
 * Output on its own says how fast a bike is in a straight line, which is not
 * what makes a dual sport good. What a rider feels is how much of it there is to
 * move: 63 hp in the 126 kg Ducati is a livelier machine than 72 hp in a 208 kg
 * Tenere, and scoring raw output said the opposite.
 *
 * Weight is kerb, not dry, because that is the bike you actually push.
 *
 * Both benchmarks are fixed and neither is reached here, so a heavier bike can
 * never buy the axis back with more engine, and the best bike on it is not
 * handed full marks just for leading the field.
 */
const PW_FULL_MARKS = 0.6; // hp per kg
const TW_FULL_MARKS = 0.6; // Nm per kg

export function performance(b: Bike): number {
  return (b.n.hp / b.n.wetKg / PW_FULL_MARKS + b.n.nm / b.n.wetKg / TW_FULL_MARKS) / 2;
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

/**
 * Service is scored on a soft knee rather than against the field.
 *
 * Min-max scaling handed full marks to whoever published the longest interval,
 * which is a number a manufacturer can raise without changing the motorcycle.
 * It was worth over a point of the overall score to the 790 and 890.
 *
 * KTM's own schedule reads "15,000 km or annually, whichever comes first", so
 * once the interval covers a year's riding it stops changing how often the bike
 * is actually booked in. Past the knee it still counts, at roughly a third of
 * the rate: 6,000 miles scores 8.5, and the 9,320-mile bikes still reach 10.
 */
const SERVICE_KNEE = 6000; // about 10,000 km, a year for most riders
const SERVICE_AT_KNEE = 0.85;
const SERVICE_HI = Math.max(...bikes.map(serviceMiles));
const serviceScore = (mi: number) => kneeScore(mi, SERVICE_KNEE, SERVICE_HI, SERVICE_AT_KNEE);

export const AXES: Axis[] = [
  {
    key: "service",
    label: "Service",
    value: serviceMiles,
    display: (b) => b.spec.serviceInterval,
    absolute: (b) => serviceScore(serviceMiles(b)),
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
  return polygonScore(AXES.map((a) => score(b, a)));
}

/** Area of the polygon those spokes enclose, rooted so a flat x reads as x. */
function polygonScore(r: number[]): number {
  const paired = r.reduce((sum, v, i) => sum + v * r[(i + 1) % r.length], 0);
  return Math.sqrt(paired / r.length);
}

/**
 * How good the bike is to ride, ignoring what it costs to own.
 *
 * Performance, offroad ease and highway comfort only: the three axes about being
 * on the bike. Service interval and range are real considerations, but they are
 * about running it, and they dominate the overall standing enough that a big
 * adventure twin can win it while being beaten on every riding axis by a single
 * half its price.
 *
 * Same area shape as the overall standing, over a triangle instead of a
 * pentagon, so the two numbers are read the same way.
 */
const RIDING_AXES = ["performance", "offroad", "highway"];

export function riding(b: Bike): number {
  return polygonScore(AXES.filter((a) => RIDING_AXES.includes(a.key)).map((a) => score(b, a)));
}
