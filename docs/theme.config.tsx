/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: <span>basement scrollytelling</span>,
  project: {
    link: 'https://github.com/basementstudio/scrollytelling',
  },
  chat: {
    link: 'https://discord.gg/CFM7dtXX',
  },
  docsRepositoryBase: 'https://github.com/basementstudio/scrollytelling/tree/main/docs',
  footer: {
    text: '© basement.studio | ' + new Date().getFullYear(),
  },
  primaryHue: 21,
  primarySaturation: 94,
  feedback: {
    content: 'Give us feedback on GitHub!',
    labels: "documentation",
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: 'dark',
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – BSMNT Scrollytelling | Docs',
      }
    }
  }
}

export default config
