import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>basement scrollytelling</span>,
  project: {
    link: 'https://github.com/basementstudio/scrollytelling',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/basementstudio/scrollytelling/tree/main/docs',
  footer: {
    text: '© basement.studio | ' + new Date().getFullYear(),
  },
  primaryHue: 21,
  primarySaturation: 94,
}

export default config
