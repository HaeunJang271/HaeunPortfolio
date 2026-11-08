import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/v0/b/**" }],
  },
};

export default nextConfig;
