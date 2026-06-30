import type { LoaderData } from '@/lib/types'
import { BASE_URL, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants'

export const generateHomePageMeta = (data: LoaderData | undefined) => {
  const fallbackData: LoaderData = {
    versionNumber: 0,
    version: 'unknown',
    latestNextVersion: 'unknown',
    latestNextMajorVersion: 0,
    vercelVersionHistory: [],
  }

  const { version, latestNextVersion, versionNumber, latestNextMajorVersion } =
    data ?? fallbackData

  const exactMatch = version === latestNextVersion
  const majorMatch = versionNumber === latestNextMajorVersion

  const status = exactMatch ? 'Exact match' : majorMatch ? 'Close' : 'Behind'
  const description = exactMatch
    ? `OpenNextJS Cloudflare and Vercel Next.js are both on ${version}.`
    : `OpenNextJS Cloudflare is on ${version}, Vercel's latest is ${latestNextVersion}.`

  const siteUrl = BASE_URL

  return {
    meta: [
      {
        title: `OpenNextJS Cloudflare vs Vercel Next.js | ${status}`,
      },
      {
        name: 'description',
        content: description,
      },
      {
        name: 'keywords',
        content:
          'OpenNextJS, Cloudflare, Next.js 16, Next.js, React, Cloudflare Workers, deployment',
      },
      {
        name: 'author',
        content: SITE_NAME,
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        property: 'og:title',
        content: `OpenNextJS Cloudflare vs Vercel Next.js | ${status}`,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: siteUrl,
      },
      {
        property: 'og:site_name',
        content: SITE_NAME,
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      {
        property: 'og:image',
        content: `${BASE_URL}/og-image.png`,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: `OpenNextJS Cloudflare vs Vercel Next.js: ${status}`,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: `OpenNextJS Cloudflare vs Vercel Next.js | ${status}`,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: `${BASE_URL}/og-image.png`,
      },
      {
        name: 'twitter:url',
        content: siteUrl,
      },
      {
        name: 'twitter:site',
        content: TWITTER_HANDLE,
      },
      {
        name: 'twitter:creator',
        content: TWITTER_HANDLE,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: siteUrl,
      },
    ],
  }
}
