import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  output: "export",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: true
  },
};
export default nextConfig;
