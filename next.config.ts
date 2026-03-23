import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your Android phone to connect to the dev server
  allowedDevOrigins: ["192.168.1.7"],
};

export default nextConfig;