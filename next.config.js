//Improve developer experience.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
