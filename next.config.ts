import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Specify Node.js runtime instead of Edge for better compatibility
  experimental: {},

  // Add other Next.js config options here as needed
  reactStrictMode: true, // Enable React's Strict Mode
  swcMinify: true, // Enable SWC-based minification for better performance
  env: {
    // Custom environment variables
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
