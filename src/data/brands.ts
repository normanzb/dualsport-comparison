/**
 * Brand identity colours as weighted stripes, most significant first.
 *
 * These are the marque's own colours, not the single `ink` accent each row is
 * themed with. The weight is the stripe's share of the swatch, so a brand that is
 * mostly one colour with a flash of another reads that way rather than as equal
 * halves.
 */
export type Stripe = readonly [color: string, weight: number];

export const BRAND_COLORS: Record<string, readonly Stripe[]> = {
  AJP: [
    ["#F4F5F7", 3],
    ["#E4322B", 1],
    ["#1B3F94", 1],
  ],
  // M Performance stripe order: light blue, dark blue, red
  BMW: [
    ["#6CA5DC", 1],
    ["#0166B1", 1],
    ["#E32219", 1],
  ],
  CCM: [
    ["#012169", 3],
    ["#FFFFFF", 1],
    ["#C8102E", 2],
    ["#FFFFFF", 1],
    ["#012169", 3],
  ],
  CFMoto: [["#00A0E9", 1]],
  Ducati: [["#C8102E", 1]],
  Honda: [
    ["#E4002B", 6],
    ["#0B4EA2", 1],
  ],
  // Swedish flag blue and yellow
  Husqvarna: [
    ["#006AA7", 1],
    ["#FECC00", 1],
  ],
  KTM: [["#FF6600", 1]],
  Kove: [["#1EB8AE", 1]],
  "Moto Morini": [
    ["#D0021B", 4],
    ["#F4F5F7", 1],
    ["#1A1A1A", 1],
  ],
  Rieju: [
    ["#E4322B", 3],
    ["#F4F5F7", 1],
    ["#1B3F94", 1],
  ],
  Suzuki: [
    ["#FFD900", 1],
    ["#003DA5", 1],
  ],
  Voge: [
    ["#1B4FA0", 3],
    ["#F4F5F7", 1],
  ],
  // logo red dropped: it is a corporate mark, and no Yamaha here wears any
  Yamaha: [["#4070FF", 1]],
};

/** Falls back to the bike's own accent so a new make still renders something. */
export const brandColors = (make: string, fallback: string): readonly Stripe[] =>
  BRAND_COLORS[make] ?? [[fallback, 1]];
