/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/blogs",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXT_GRAPHQL_URL: process.env.NEXT_GRAPHQL_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
