"use client";

import { Tooltip } from "@/components/Tooltip";
import { AXES, score } from "@/data/abilities";
import type { Bike } from "@/data/bikes";

/** One note per axis, read by the caption list and by each vertex tooltip. */
const NOTES: Record<string, string> = {
  service:
    "full rate to 6,000 miles, about a year's riding, then roughly a third of that rate, because past a year the interval stops changing how often the bike is booked in. The axis sits in a band from 3 rather than running to zero: a 600-mile interval is expensive, not worthless.",
  range:
    "tank size times real-world economy, against a fixed 500-mile benchmark that nothing here reaches.",
  performance:
    "power and torque per kilogram, weighted equally, against fixed benchmarks of 0.6 hp/kg and 0.6 Nm/kg that nothing here reaches, plus stopping at half that weight. Output alone says how fast a bike is in a straight line; what a rider feels is how much of it there is to move, and how much of it there is to stop on a narrow knobbly.",
  offroad:
    "how readily a bike goes off the tarmac, not how capable it is once there. Every bike starts at 6 and weight takes away from it, because no amount of mass helps off road. 100 kg dry is where it starts costing, and nothing here is under that, so every bike pays something. Clearance at 1, a low centre of gravity at 0.5 and a low seat at 0.3 earn it back; weight at 2 is what takes it away. You can ride around what a low bike would ground on, but you cannot lift a heavy one out of a rut. A big adventure bike scores low because it is awkward to take off road, not because it cannot go.",
  highway:
    "engine size 4, wind protection 3, top-gear comfort 1. Wind protection is judged 0 to 5 on an absolute scale, by how much of the rider is actually shielded rather than by what the bike is called. 3 lifts the blast off your chest and leaves your shoulders in it, and is the best on this list; 4 is added wide bodywork; 5 is a touring level fairing.",
};

const R = 118;
const CX = 220;
const CY = 180;
// five axes: PERFORMANCE, the longest label, sits at the lower-right vertex where
// there is horizontal room for it
const VB_W = 440;
const VB_H = 340;
const RINGS = [0.25, 0.5, 0.75, 1];

const pt = (i: number, r: number) => {
  const a = (-90 + (360 / AXES.length) * i) * (Math.PI / 180);
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
};
const poly = (r: (i: number) => number) => AXES.map((_, i) => pt(i, r(i)).join(",")).join(" ");

export function AbilityChart({ bike }: { bike: Bike }) {
  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full"
        role="img"
        aria-label={`Ability chart for the ${bike.make} ${bike.model}`}
      >
        {/* grid */}
        <g>
          {RINGS.map((k) => (
            <polygon
              key={k}
              points={poly(() => R * k)}
              fill="none"
              stroke="var(--color-hair)"
              strokeWidth={1}
            />
          ))}
          {AXES.map((_, i) => {
            const [x, y] = pt(i, R);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="var(--color-hair)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* value */}
        <polygon
          points={poly((i) => R * score(bike, AXES[i]))}
          fill="var(--livery)"
          fillOpacity={0.22}
          stroke="var(--livery)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {AXES.map((a, i) => {
          const [x, y] = pt(i, R * score(bike, a));
          return <circle key={a.key} cx={x} cy={y} r={3.5} fill="var(--livery)" />;
        })}

        {/* labels */}
        {AXES.map((a, i) => {
          const [x, y] = pt(i, R + 30);
          const anchor = Math.abs(x - CX) < 12 ? "middle" : x > CX ? "start" : "end";
          return (
            <Tooltip
              key={a.key}
              as="g"
              title={a.label}
              content={NOTES[a.key]}
              className="cursor-help"
            >
              <text
                x={x}
                y={y - 3}
                textAnchor={anchor}
                className="fill-ink-dim"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {a.label}
              </text>
              <text
                x={x}
                y={y + 12}
                textAnchor={anchor}
                style={{ fontSize: 13, fill: "var(--livery)" }}
              >
                {a.display(bike)}
              </text>
            </Tooltip>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        <p className="text-ink-dim">
          Further out is better. Each axis scores against a fixed benchmark, never against the rest
          of the field.
        </p>
        <dl className="mt-2 hidden space-y-1.5 md:block">
          {AXES.map((a) => (
            <div key={a.key} className="sm:flex sm:gap-2">
              <dt className="shrink-0 text-ink-dim sm:w-[86px]">{a.label}</dt>
              <dd className="sm:flex-1">{NOTES[a.key]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2">
          Offroad ease, performance and highway are indices out of ten, not measurements.
          Hours-based service intervals sit at a 30 mph working average.
        </p>
      </figcaption>
    </figure>
  );
}
