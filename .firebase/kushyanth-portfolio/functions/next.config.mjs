// next.config.mjs
var nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
