import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Dev and build must not share a distDir: `next build` clobbers the dev
  // server's incremental artifacts, which surfaces as ENOENT build-manifest
  // errors and the "missing required error components" refresh loop.
  distDir: process.env.NODE_ENV === "development" ? ".next" : "dist",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
