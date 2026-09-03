/**
 * Marks the bike easiest to take off road.
 *
 * A feather rather than a mountain or a tyre tread, because the axis measures
 * lightness and manageability, not terrain capability: it is the mark for the
 * bike you can pick up, not the one that will climb anything.
 *
 * Same CSS-mask construction as the crown and the diamond, so the three read as
 * a set, and it borrows the crown's tier metals: the metal says the rank, the
 * shape says which ranking.
 */
const W = 20;
const H = 22;

const TIERS = {
  1: { metal: "gold", name: "Easiest off road" },
  2: { metal: "silver", name: "Second easiest off road" },
  3: { metal: "bronze", name: "Third easiest off road" },
} as const;

export type Tier = keyof typeof TIERS;

export function Feather({
  tier,
  size = 12,
  className,
}: {
  tier: Tier;
  size?: number;
  className?: string;
}) {
  const { metal, name } = TIERS[tier];
  return (
    <span
      className={`crown plume crown-${metal}${className ? ` ${className}` : ""}`}
      style={{ height: size, width: (size * W) / H }}
      role="img"
      aria-label={name}
      title={`${name}: lightest to handle, not the most capable`}
    >
      <span aria-hidden />
    </span>
  );
}
