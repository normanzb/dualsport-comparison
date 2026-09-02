/**
 * Base path for hand-written asset URLs.
 *
 * Anything Next does not rewrite for us has to go through here or it 404s on
 * GitHub Pages: URLs built inside a style attribute, and next/image sources,
 * because next/image skips basePath entirely once images are unoptimized.
 * Read as a literal so Next can inline it at build time.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
