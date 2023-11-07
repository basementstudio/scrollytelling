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
    images: {
      domains: ["user-images.githubusercontent.com"],
    },
    basePath: '/docs',
  }),
}
