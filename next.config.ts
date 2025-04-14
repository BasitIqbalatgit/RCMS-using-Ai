import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@mapbox/node-pre-gyp"); // Avoid bundling this module
    }
    return config;
  },

  eslint:{
    ignoreDuringBuilds: true
  },
  
  typescript:{
    ignoreBuildErrors: true
  },
};

export default nextConfig;
