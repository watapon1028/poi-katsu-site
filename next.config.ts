/*import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //config options here
};

export default nextConfig;
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/**', // ←さらに安全にするためパスも許可！
      },
    ],
  },
};

export default nextConfig;