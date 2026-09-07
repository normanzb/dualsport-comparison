import { bikes } from "@/data/bikes";
import { overall } from "@/data/abilities";
import { photosFor } from "@/data/photos";
import { SITE_ORIGIN, bikePath } from "@/lib/bike-url";

export const SITE_NAME = "Dualsport motorcycle side by side";
export const SITE_TITLE = `${SITE_NAME} (UK market)`;

export const SITE_DESCRIPTION =
  `A single-page comparison of ${bikes.length} dual sport and enduro motorcycles: service ` +
  "intervals, weights, tank capacity, seat height, ground clearance, power and typical UK prices.";

/** The sheet is about the standing, so its own card is whatever currently wins it. */
const winner = [...bikes].sort((a, b) => overall(b) - overall(a))[0];

/**
 * The shipped cutout, on the shared 1600x960 canvas. It is transparent, so a
 * scraper composites it on its own background; these were shot on white, which
 * is what that lands on.
 */
export const ogImage = (slug?: string) => {
  const set = photosFor(slug ?? winner.slug) ?? photosFor(winner.slug);
  return { url: set?.views[0]?.src ?? "", width: 1600, height: 960 };
};

export const canonicalFor = (slug?: string) => (slug ? bikePath(slug) : "/");

export const siteUrl = (slug?: string) => `${SITE_ORIGIN}${canonicalFor(slug)}`;
