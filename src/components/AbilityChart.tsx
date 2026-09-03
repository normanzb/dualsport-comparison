import { AXES, score } from "@/data/abilities";
import type { Bike } from "@/data/bikes";

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
            <g key={a.key}>
              <text
                x={x}
                y={y - 3}
                textAnchor={anchor}
                className="fill-ink-dim"
                style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}
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
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-[10px] leading-relaxed text-ink-faint">
        Further out is better. Range is tank size times real-world economy, scored against a fixed
        500-mile benchmark that nothing here reaches. Offroad ease is how readily a bike goes off
        the tarmac, not how capable it is once there: mass and ground clearance weighted equally, a
        low centre of gravity at 0.5 and a low seat at 0.3. A big adventure bike scores low because
        it is awkward to take off road, not because it cannot go. Performance is power and torque
        weighted equally. Highway weights engine size 4, wind protection 3 and top-gear comfort 1.
        Service runs on a soft knee: full rate up to 6,000 miles, which is about a year&rsquo;s
        riding, then roughly a third of that rate beyond, because past a year the interval stops
        changing how often the bike is booked in. Offroad ease, performance and highway are indices
        out of ten, not measurements. Hours-based service intervals sit at a 30 mph working average.
        The overall figure, where a bike claims it, is the area of this shape as a fraction of the
        full pentagon, so it rewards an all-rounder over a specialist: the easiest bike here to take
        off road is nowhere near the top of it.
      </figcaption>
    </figure>
  );
}
