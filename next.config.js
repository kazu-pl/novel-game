/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // this register this url as a host that Next can use to serve remote images
  images: {
    domains: ["novel-server-dev.herokuapp.com"],
  },

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
