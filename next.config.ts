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
        hostname: "assignmentghar.com",
      },
      {
        protocol: "https",
        hostname: "www.assignmentghar.com",
      },
    ],
  },
};

export default nextConfig;
