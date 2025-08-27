import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fengmi-tarot.oss-cn-shenzhen.aliyuncs.com',
        port: '',
        pathname: '/yijing/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dev.guara.fun/:path*',
      },
    ];
  },
};

export default nextConfig;
