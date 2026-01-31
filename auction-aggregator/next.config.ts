import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.klaravik.se",
      },
      {
        protocol: "https",
        hostname: "www.blinto.se",
      },
      {
        protocol: "https",
        hostname: "www.budi.se",
      },
    ],
  },
};

export default nextConfig;
