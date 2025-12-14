import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    // Sharp will automatically convert to WebP when installed
    formats: ["image/webp"],
    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 minute
    minimumCacheTTL: 60,
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.mulearn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mulearn.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.propeers.in",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
