import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React Strict Mode
  images: {
    domains: [
      "via.placeholder.com",
      "unsplash.com",
      "plus.unsplash.com",
      "i.redd.it",
      "images.unsplash.com",
    ], // Allow images from via.placeholder.com
  },
};

export default nextConfig;
