import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
