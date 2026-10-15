import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/vi",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
