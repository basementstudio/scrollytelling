/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

export const siteURL = new URL(process.env.NEXT_PUBLIC_SCROLLY_URL)
export const siteOrigin = siteURL.origin

const defaultMeta = {
  title: 'BSMNT Scrollytelling | Docs',
  description: "Docs for our animation library, @bsmnt/scrollytelling.",
  ogImage: `${siteOrigin}/og.jpg`,
  twitter: {
    cardType: 'summary_large_image',
    handle: '@basementstudio',
    site: '@basementstudio'
  }
}

const config: DocsThemeConfig = {
  logo: <span>docs | basement scrollytelling</span>,
  project: {
    link: 'https://github.com/basementstudio/scrollytelling',
  },
  head: (<>
    <meta
      name="viewport"
      key="viewport"
      content="width=device-width, height=device-height, initial-scale=1, shrink-to-fit=no"
    />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link
      rel="icon"
      href={'/favicon.svg'}
      sizes="any"
      type="image/svg+xml"
    />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>{defaultMeta.title}</title>
    <meta name="description" content={defaultMeta.description} />
    <meta name="twitter:card" content={defaultMeta.twitter.cardType} />
    <meta name="twitter:site" content={defaultMeta.twitter.site} />
    <meta name="twitter:creator" content={defaultMeta.twitter.site} />
    <meta name="twitter:title" content={defaultMeta.title} />
    <meta
      name="twitter:description"
      content={defaultMeta.description}
    />
    <meta name="twitter:image" content={defaultMeta.ogImage} />
    <meta property="og:title" content={defaultMeta.title} />
    <meta
      property="og:description"
      content={defaultMeta.description}
    />
    <meta property="og:image" content={defaultMeta.ogImage} />
    <meta property="og:image:alt" content={defaultMeta.title} />
    <meta
      property="og:image:width"
      content={"1200"}
    />
    <meta
      property="og:image:height"
      content={"630"}
    /></>
  ),
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
