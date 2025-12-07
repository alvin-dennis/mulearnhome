import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
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
      {
        protocol: "https",
        hostname: "mulearn.org",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/events/saltmangotree",
        destination: "/events/salt-mango-tree",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
