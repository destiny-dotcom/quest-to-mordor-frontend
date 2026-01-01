import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Use empty turbopack config to silence warning
  // next-pwa uses webpack internally
  turbopack: {},
  // Proxy API requests to backend in development to avoid CORS
  async rewrites() {
    // Only add rewrites if API URL is configured
    if (!apiUrl) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
