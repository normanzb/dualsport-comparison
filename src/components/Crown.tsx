"use client";

import { Tooltip } from "@/components/Tooltip";

/**
 * Marks a bike in the top three by ability-chart area: gold, silver, bronze.
 *
 * The crown is a CSS mask defined in globals.css, not an inline SVG, so the metal
 * sweep and the glow are ordinary CSS animations that reduced-motion can switch
 * off. `size` is the rendered height and the width follows the mark's own
 * proportions, so it lines up with text of the same size.
 */
const ASPECT = 22 / 14;

const TIERS = {
  1: { metal: "gold", name: "Best overall" },
  2: { metal: "silver", name: "Second best overall" },
  3: { metal: "bronze", name: "Third best overall" },
} as const;

const WHY =
  "Ranked on the area of its ability chart across all five axes: service interval, range, performance, offroad ease and highway comfort.";

export type Tier = keyof typeof TIERS;

export function Crown({
  tier,
  size = 10,
  className,
}: {
  tier: Tier;
  size?: number;
  className?: string;
}) {
  const { metal, name } = TIERS[tier];
  return (
    <Tooltip title={name} content={WHY}>
      <span
        className={`crown crown-${metal}${className ? ` ${className}` : ""}`}
        style={{ height: size, width: size * ASPECT }}
        role="img"
        aria-label={name}
      >
        <span aria-hidden />
      </span>
    </Tooltip>
  );
}
