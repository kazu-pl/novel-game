/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Allows to use SVG as ReactComponent
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      // issuer: {
      // test: /\.(js|ts)x?$/,
      // },
      use: ["@svgr/webpack", "url-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
