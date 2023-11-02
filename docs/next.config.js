const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = {
  assetPrefix: process.env.NEXT_PUBLIC_SITE_URL, 
  ...withNextra(),
}
