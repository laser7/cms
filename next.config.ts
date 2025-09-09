import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fengmi-tarot.oss-cn-shenzhen.aliyuncs.com",
        port: "",
        pathname: "/yijing/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.haikei.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.krea.ai",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.krea.ai",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "krea.ai",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.imgur.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://dev.guara.fun/:path*",
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
