/** Schematic dual-sport side view. Points the way the view it selects points. */
export function BikeGlyph({
  side,
  className,
}: {
  side: "left" | "right";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 28" className={className} aria-hidden focusable="false">
      <g
        transform={side === "left" ? "translate(48,0) scale(-1,1)" : undefined}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx={10} cy={19} r={6.5} />
        <circle cx={38} cy={19} r={6.5} />
        <path d="M10 19 L15 12 L25 11 L31 8" />
        <path d="M31 8 L38 19" />
        <path d="M15 12 L23 7 L29 7" />
        <path d="M31 8 L33 3 L39 3" />
      </g>
    </svg>
  );
}
