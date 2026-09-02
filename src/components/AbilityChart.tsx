import { AXES, score } from "@/data/abilities";
import type { Bike } from "@/data/bikes";

const R = 118;
const CX = 220;
const CY = 182;
// six axes: widest labels sit at the left and right vertices, longest (PERFORMANCE)
// is centred at the bottom where it has room
const VB_W = 440;
const VB_H = 362;
const RINGS = [0.25, 0.5, 0.75, 1];

const pt = (i: number, r: number) => {
  const a = (-90 + (360 / AXES.length) * i) * (Math.PI / 180);
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
};
const poly = (r: (i: number) => number) =>
  AXES.map((_, i) => pt(i, r(i)).join(",")).join(" ");

export function AbilityChart({ bike }: { bike: Bike }) {
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" role="img"
        aria-label={`Ability chart for the ${bike.make} ${bike.model}`}>
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
            return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--color-hair)" strokeWidth={1} />;
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
        Further out is better, so wet weight and seat height are inverted. Range is tank size times
        real-world economy, scored against a fixed 500 mile benchmark that nothing here reaches.
        Performance is power and torque weighted equally. Highway weights engine size and wind
        protection 3 each against top-gear comfort 1, and is an index out of ten rather than a
        measurement. Hours-based service intervals sit at a 30 mph working average.
      </figcaption>
    </figure>
  );
}
