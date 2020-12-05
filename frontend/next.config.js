const withImages = require("next-images");
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
  target: "serverless",
};
module.exports = withImages(nextConfig);
