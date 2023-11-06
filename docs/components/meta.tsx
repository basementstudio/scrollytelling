import NextHead from 'next/head'
import * as React from 'react'

type BasicMeta = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  noFollow?: boolean
  themeColor?: string
  preload?: { href: string; as: string; type: string; crossOrigin?: string }[]
  prefetch?: { href: string; as: string; type: string; crossOrigin?: string }[]
}

export const siteURL = new URL(process.env.NEXT_PUBLIC_SITE_URL)
export const siteOrigin = siteURL.origin

const defaultMeta = {
  title: 'BSMNT Scrollytelling | Docs',
  description: `Developer-friendly publisher of fine indie games.`,
  ogImage: `${siteOrigin}/og.jpg`,
  twitter: {
    handle: '@nullgames',
    site: '@nullgames'
  }
}

export type MetaProps = BasicMeta

export const Meta = (props: MetaProps) => {
  

  const resolvedMetadata = React.useMemo(() => {
    const data = {
      title: props.title ?? defaultMeta.title,
      description: props.description ?? defaultMeta.description,
      ogImage: {
        url: props.ogImage ?? defaultMeta.ogImage,
        alt: props.title ?? defaultMeta.title,
        width: 1200,
        height: 630
      },
      twitter: {
        cardType: 'summary_large_image',
        handle: defaultMeta.twitter.handle,
        site: defaultMeta.twitter.site
      },
      noIndex: props.noIndex,
      noFollow: props.noFollow
    }

    if (!data.ogImage.url.startsWith('http')) {
      throw new Error('ogImage must be an absolute URL.')
    }

    return data
  }, [
    props.description,
    props.noFollow,
    props.noIndex,
    props.ogImage,
    props.title
  ])

  return (
    <>
      <NextHead>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          key="viewport"
          content="width=device-width, height=device-height, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content={props.themeColor ?? '#000000'} />

        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link
          rel="icon"
          href={'/favicon.svg'}
          sizes="any"
          type="image/svg+xml"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {resolvedMetadata.noIndex && <meta name="robots" content="noindex" />}
        {resolvedMetadata.noFollow && <meta name="robots" content="nofollow" />}

        <title>{resolvedMetadata.title}</title>
        <meta name="description" content={resolvedMetadata.description} />
        <meta name="twitter:card" content={resolvedMetadata.twitter.cardType} />
        <meta name="twitter:site" content={resolvedMetadata.twitter.site} />
        <meta name="twitter:creator" content={resolvedMetadata.twitter.site} />
        <meta name="twitter:title" content={resolvedMetadata.title} />
        <meta
          name="twitter:description"
          content={resolvedMetadata.description}
        />
        <meta name="twitter:image" content={resolvedMetadata.ogImage.url} />
        <meta property="og:title" content={resolvedMetadata.title} />
        <meta
          property="og:description"
          content={resolvedMetadata.description}
        />
        <meta property="og:image" content={resolvedMetadata.ogImage.url} />
        <meta property="og:image:alt" content={resolvedMetadata.ogImage.alt} />
        <meta
          property="og:image:width"
          content={resolvedMetadata.ogImage.width + ''}
        />
        <meta
          property="og:image:height"
          content={resolvedMetadata.ogImage.height + ''}
        />

        {props.preload?.map(({ href, as }) => (
          <link key={href} rel="preload" href={href} as={as} />
        ))}
        {props.prefetch?.map(({ href, as }) => (
          <link key={href} rel="prefetch" href={href} as={as} />
        ))}
      </NextHead>
    </>
  )
}
