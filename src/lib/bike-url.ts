import { basePath } from "@/lib/base-path";

/**
 * A bike is a page, not a query. Every URL here carries the base path and the
 * trailing slash the static export is built with, so pushState never disagrees
 * with the prerendered file it stands in for.
 */
export const bikePath = (slug: string) => `${basePath}/bikes/${slug}/`;

export const sheetPath = () => `${basePath}/`;

/**
 * Where the site is published. Hardcoded rather than read off the live location
 * so a link shown on a bike reads as the public address even in dev, which is
 * where screenshots get taken. Must match public/CNAME: the Pages workflow uses
 * that same file to decide whether a base path is needed at all.
 */
export const SITE_ORIGIN = "https://bikes.norm.im";

export const bikeUrl = (slug: string) => `${SITE_ORIGIN}${bikePath(slug)}`;

export function slugFromPath(): string | null {
  const rest = window.location.pathname.slice(basePath.length);
  return /^\/bikes\/[^/]+\/?$/.test(rest) ? rest.split("/").filter(Boolean)[1] : null;
}

export function writeBikeToUrl(slug: string | null, push: boolean) {
  const next = slug ? bikePath(slug) : sheetPath();
  if (next === window.location.pathname) return;
  window.history[push ? "pushState" : "replaceState"](null, "", next + window.location.search);
}
