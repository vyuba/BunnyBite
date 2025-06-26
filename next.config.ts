import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    process.env.SHOPIFY_APP_URL!,
    "*.ngrok-free.app",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
