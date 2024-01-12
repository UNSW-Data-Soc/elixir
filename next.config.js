/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // TODO: remove coz dangerous
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
