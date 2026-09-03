/**
 * Marks the bike that scores highest on the three riding axes.
 *
 * Same CSS-mask construction as the crown, so the two read as a matched pair of
 * marks rather than two unrelated icons. Cut stone rather than metal: the crown
 * is for the overall standing, this is for how good the bike is to ride.
 */
const W = 20;
const H = 18;

export function Diamond({ size = 10, className }: { size?: number; className?: string }) {
  return (
    <span
      className={`crown gem${className ? ` ${className}` : ""}`}
      style={{ height: size, width: (size * W) / H }}
      role="img"
      aria-label="Best to ride"
      title="Best to ride: performance, offroad ease and highway comfort combined"
    >
      <span aria-hidden />
    </span>
  );
}
