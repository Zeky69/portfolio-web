import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  // Permet un build de prod pendant que `next dev` tourne (dossiers séparés)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
