/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['i.ibb.co', 'via.placeholder.com'],
  },
  // Enable static file serving
  trailingSlash: true,
};

module.exports = nextConfig;
