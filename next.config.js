/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: { domains: [] },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
