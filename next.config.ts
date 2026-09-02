import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project repo from /<repo>, so the build needs a base path,
 * and it has no server, so images cannot be optimised on demand. Both are driven by
 * NEXT_PUBLIC_BASE_PATH, which the Pages workflow sets and local dev leaves empty.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
