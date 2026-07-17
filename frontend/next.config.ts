import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE || "https://nexuschat-user.onrender.com",
    NEXT_PUBLIC_CHAT_SERVICE: process.env.NEXT_PUBLIC_CHAT_SERVICE,
  },
};

export default nextConfig;
