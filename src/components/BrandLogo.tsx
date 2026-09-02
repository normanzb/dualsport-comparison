/**
 * Brand marks normalised by cap height, not by bounding box.
 *
 * Every SVG is cropped to its wordmark, so sizing them all to one height makes
 * eight different marks read at the same optical weight. Widths then differ
 * honestly (KTM is three letters, Honda is five), which is why callers give the
 * logo a fixed slot to sit in rather than sizing to content.
 *
 * `optical` nudges marks whose bounding box overshoots their cap height, such as
 * Husqvarna carrying a shield and a registered symbol.
 */
import { asset } from "@/lib/base-path";

type Mark = { file: string; aspect: number; optical?: number };

const MARKS: Record<string, Mark> = {
  Ducati: { file: "/logos/ducati.svg", aspect: 5.411 },
  Honda: { file: "/logos/honda.svg", aspect: 8.228 },
  Husqvarna: { file: "/logos/husqvarna.svg", aspect: 5.475, optical: 1.24 },
  KTM: { file: "/logos/ktm.svg", aspect: 3.203 },
  Suzuki: { file: "/logos/suzuki.svg", aspect: 6.424 },
  Yamaha: { file: "/logos/yamaha.svg", aspect: 4.266 },
};

/** Makes with a real logo file. Everything else falls back to a wordmark. */
export const MARK_MAKES = Object.keys(MARKS);

export function BrandLogo({
  make,
  height,
  tone = "ink",
  className,
}: {
  make: string;
  /** cap height in px; every brand is drawn to this */
  height: number;
  tone?: "ink" | "livery";
  className?: string;
}) {
  const color = tone === "livery" ? "var(--livery)" : "var(--color-ink)";
  const mark = MARKS[make];

  if (!mark) {
    // no freely licensed mark: set the name in the display face at the same cap height
    return (
      <span
        className={`font-display leading-none tracking-wide ${className ?? ""}`}
        style={{ color, fontSize: height / 0.72 }}
        aria-label={`${make} wordmark`}
      >
        {make}
      </span>
    );
  }

  const h = height * (mark.optical ?? 1);
  return (
    <span
      className={`block shrink-0 ${className ?? ""}`}
      style={{
        height: h,
        width: h * mark.aspect,
        backgroundColor: color,
        WebkitMaskImage: `url(${asset(mark.file)})`,
        maskImage: `url(${asset(mark.file)})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
      role="img"
      aria-label={`${make} logo`}
    />
  );
}
