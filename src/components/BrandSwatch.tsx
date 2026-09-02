import { brandColors } from "@/data/brands";

/**
 * The marque's colors as a segmented disc, each stripe sized by its weight so a
 * brand that is mostly one color reads that way. The table only renders it for
 * bikes that have a studio photo, so its presence doubles as that signal.
 * Decorative, so
 * it is hidden from assistive tech: the make is already in the row as text.
 */
export function BrandSwatch({
  make,
  fallback,
  size = 11,
}: {
  make: string;
  fallback: string;
  size?: number;
}) {
  const stripes = brandColors(make, fallback);
  return (
    <span
      aria-hidden
      title={make}
      className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-white/15"
      style={{ width: size, height: size }}
    >
      {stripes.map(([color, weight], i) => (
        <span
          // index, not color: a symmetric palette repeats colors
          key={`${color}-${i}`}
          className="h-full"
          style={{ background: color, flexGrow: weight, flexBasis: 0 }}
        />
      ))}
    </span>
  );
}
