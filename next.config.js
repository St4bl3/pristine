// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React Strict Mode

  images: {
    domains: [
      "via.placeholder.com",
      "unsplash.com",
      "plus.unsplash.com",
      "i.redd.it",
      "images.unsplash.com",
    ], // Allow images from specified domains
  },
};

module.exports = nextConfig;