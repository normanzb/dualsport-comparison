import { Crown, type Tier } from "@/components/Crown";
import type { Bike } from "@/data/bikes";
import { AXES, overall, score } from "@/data/abilities";
import { overallPodium, overallRank } from "@/data/superlatives";

/**
 * The podium and its wording both come off the same derived table as the chips,
 * so this section cannot fall out of step with the crowns above it.
 */
/** Which spoke carries the shape and which one lets it down. */
function shape(b: Bike) {
  const ranked = [...AXES].sort((x, y) => score(b, y) - score(b, x));
  return `strongest ${ranked[0].label.toLowerCase()}, weakest ${ranked.at(-1)?.label.toLowerCase()}`;
}

export function OverallExplainer() {
  return (
    <section className="mt-14 border-t border-hair pt-10 lg:mt-20">
      <h2 className="font-display text-3xl leading-none md:text-4xl">
        How the overall standing works
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="space-y-4 text-[12px] leading-relaxed text-ink-dim">
          <p>
            Each bike&rsquo;s ability chart encloses a shape. The overall standing is simply how
            much of the {AXES.length}-sided figure that shape fills, so a bike has to be good on
            several axes at once to place well. Nothing is weighted by hand at this stage: the
            weighting all happens inside the individual axes.
          </p>

          <pre className="overflow-x-auto border-l border-hair py-1 pl-3 text-[11px] text-ink-faint">
            {`area  = ½ · sin(360°/${AXES.length}) · Σ rᵢ · rᵢ₊₁
score = √(area / full ${AXES.length}-sided figure) × 10`}
          </pre>

          <p>
            The square root is there to keep the number readable. Area grows with the square of the
            spokes, so without it a bike scoring 6 on every axis would come out at 3.6. Rooted, a
            bike that scores the same on all {AXES.length} axes reads exactly that: a straight 6
            across the chart gives 6.0 overall.
          </p>

          <p className="text-ink-faint">
            Two things it is fair to hold against it. Radar area depends on the order the axes are
            drawn in, because the same {AXES.length} scores arranged differently enclose a different
            shape. Across every distinct ordering the leader does not change here, but the figure
            moves by about half a point. And it rewards all-rounders over specialists by
            construction, which is why the easiest bike on this list to take off road places nowhere
            near the top of it.
          </p>
        </div>

        <ol className="space-y-3">
          {overallPodium.map((b) => (
            <li
              key={b.slug}
              className="flex items-center gap-4 border border-hair px-4 py-3"
              style={{ ["--livery" as string]: b.ink }}
            >
              <Crown tier={overallRank(b) as Tier} size={18} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px]">
                  {b.make} {b.model}
                  {b.year && <span className="text-ink-faint"> ({b.year})</span>}
                </span>
                <span className="text-[10px] tracking-[0.16em] text-ink-faint uppercase">
                  {shape(b)}
                </span>
              </span>
              <span
                className="font-display text-2xl leading-none"
                style={{ color: "var(--livery)" }}
              >
                {(overall(b) * 10).toFixed(2)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
