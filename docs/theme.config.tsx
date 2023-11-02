/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

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
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – BSMNT Scrollytelling',
      }
    }
  }
}

export default config