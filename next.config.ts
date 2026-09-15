import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  trailingSlash: true,
  // The post-build step flattens framework assets into /assets because this
  // SafeLine static site only serves files reliably from one directory level.
  assetPrefix: "/assets",
};

export default nextConfig;
