/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

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
  logo: () => <><svg
    className='logo'
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 251 36"
  >
    <path
      d="M0 0v34.8h8.048v-6.263c.87 4.524 3.697 6.786 8.526 6.786 8.091 0 9.918-1.958 9.918-11.702v-3.74c0-9.745-1.784-11.703-9.483-11.703-5.22 0-7.743 1.175-8.744 5.22V0H0zm8.309 18.88c.217-2.35 1.783-3.48 4.741-3.48 4.002 0 4.742.87 4.742 4.74v3.307c0 3.828-.74 4.698-4.742 4.698-2.914 0-4.48-.87-4.741-2.566v-6.7zM44.268 8.11h-2.002c-10.178 0-12.093 1.392-12.093 8.57v1.043h8.266c-.088-3.002.652-3.523 4.741-3.523 3.654 0 4.35.521 4.35 3.523v1.48l-8.265.043c-8.396 0-9.962 1.261-9.962 7.96 0 7.004 1.566 8.309 10.092 8.048 4.09-.043 7.004-1.653 8.135-5.133v4.61h8.265V17.159c0-7.613-1.827-9.049-11.528-9.049zm-6.265 19.183c0-1.653.436-1.957 2.697-1.957l6.83-.044v1.131c0 2.089-1.348 2.871-5.046 2.958h-.435c-3.393 0-4.046-.348-4.046-2.088zm28.433-.74v-.565h-7.83v.566c0 7.308 1.826 8.7 11.397 8.7h2c10.963 0 12.964-1.218 12.964-7.482 0-4.046-1-6.395-5.177-7.613-2.218-.652-4.22-1.174-8.482-1.87-2.828-.435-3.61-.957-3.61-2.045 0-1.61.87-2.044 4.088-2.044 3.35 0 4.263.609 4.263 2.74v.783h8.266v-.783c0-7.438-1.827-8.83-11.528-8.83h-2.001c-9.918 0-11.789 1.217-11.789 7.873 0 3.48.914 5.438 4.48 6.786 2.61 1 6.57 1.61 8.092 1.914 3.828.696 4.741 1.392 4.741 2.48 0 1.566-1 2-4.741 2-4.046 0-5.133-.565-5.133-2.61zm48.201-.13h-8.7c0 2.262-.74 2.74-4.742 2.74-4.263 0-5.046-.739-5.046-4.567v-.13h18.705V20.42c0-10.353-2.001-12.31-12.702-12.31h-2.001c-10.701 0-12.702 2.131-12.702 13.572 0 11.44 2 13.572 12.702 13.572h2.001c10.527 0 12.485-1.392 12.485-8.83zm-18.488-8.047v-.13c0-3.394.783-4.046 5.046-4.046 4.046 0 4.916.652 4.959 4.176H96.149zm22.363-9.745v26.1h8.266V19.638c0-3.045 1.435-4.567 4.306-4.567 3.35 0 3.959.652 3.959 4.045v15.617h8.221l-.043-15.356c.087-2.871 1.522-4.306 4.307-4.306 3.305 0 3.915.652 3.915 4.045v15.617h8.221l-.043-16.878c0-8.178-1.479-9.745-9.44-9.745-4.394 0-7.047 1.915-8.004 6.047-.348-4.96-1.784-6.047-8.352-6.047-3.915 0-6.134 1.61-7.047 5.525V8.631h-8.266zm71.565 17.792h-8.7c0 2.262-.74 2.74-4.742 2.74-4.263 0-5.046-.739-5.046-4.567v-.13h18.705V20.42c0-10.353-2.001-12.31-12.702-12.31h-2.001c-10.701 0-12.702 2.131-12.702 13.572 0 11.44 2.001 13.572 12.702 13.572h2.001c10.527 0 12.485-1.392 12.485-8.83zm-18.488-8.047v-.13c0-3.394.783-4.046 5.046-4.046 4.046 0 4.916.652 4.959 4.176h-10.005zm22.286-9.745v26.1h8.265V19.203c.043-2.784 1.566-4.132 4.567-4.132 3.828 0 4.524.74 4.524 4.741v14.92h8.266l-.044-16.877c0-8.178-1.435-9.745-9.005-9.745-4.741 0-7.308 1.61-8.308 5.83V8.63h-8.265zm46.402 18.703h-4.829c-2.523 0-3.001-.435-3.001-2.653v-9.092h7.395v-6.96h-7.395V3.06h-7.83v5.568h-3.045v6.96h2.61v10.353c0 7.395 1.696 8.787 10.44 8.787h5.655v-7.395zm10.723.057h-7.395v7.395H251V27.39z"
    ></path>
  </svg></>,
  project: {
    link: 'https://github.com/basementstudio/scrollytelling',
  },
  head: () => {
    const { asPath } = useRouter()
    const { title } = useConfig()

    return (<>
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
      <title>{asPath === "/" ? defaultMeta.title : (title + " | " + defaultMeta.title)}</title>
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
    )
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
