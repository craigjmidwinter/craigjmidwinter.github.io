import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "dist",
  images: { unoptimized: true },
  assetPrefix: "/craigjmidwinter.github.io/",
  basePath: "/craigjmidwinter.github.io",
  trailingSlash: true,
};

export default nextConfig;
