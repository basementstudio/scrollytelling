const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = {
  ...withNextra({
    assetPrefix: process.env.NEXT_PUBLIC_SITE_URL, 
    images: {
      domains: ["user-images.githubusercontent.com"],
    },
  }),
}
