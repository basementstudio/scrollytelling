const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const securityHeaders = [
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
]

module.exports = {
  ...withNextra({
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    assetPrefix: process.env.NEXT_PUBLIC_SITE_URL,
    images: {
      domains: ["user-images.githubusercontent.com"],
    },
  }),
}
