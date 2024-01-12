/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
        port: process.env.NEXT_PUBLIC_BACKEND_PORT,
        pathname: process.env.NEXT_PUBLIC_REMOTE_PATTERN_PATHNAME,
      },
      {
        // TODO: remove coz dangerous
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
