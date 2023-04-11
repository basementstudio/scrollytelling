const withBundleAnalyzer = require("@next/bundle-analyzer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    domains: ["lab.basement.studio"],
  }
};

module.exports = (_phase, { defaultConfig: _ }) => {
  const plugins = [
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" }),
  ];
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig });
};
