import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!,
    // "*.ngrok-free.app",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
