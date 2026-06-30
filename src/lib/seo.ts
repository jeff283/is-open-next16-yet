import type { LoaderData } from '@/lib/types'
import { BASE_URL, SITE_NAME, TARGET_VERSION, TWITTER_HANDLE } from '@/lib/constants'

export const generateHomePageMeta = (data: LoaderData | undefined) => {
  const fallbackData: LoaderData = {
    isOpenNext16Yet: false,
    versionNumber: 15,
    version: '15.x.x',
    latestNextVersion: `${TARGET_VERSION}.x.x`,
    latestNextMajorVersion: TARGET_VERSION,
  }

  const { isOpenNext16Yet, version, latestNextVersion } = data ?? fallbackData

  const status = isOpenNext16Yet ? 'YES' : 'NO'
  const description = isOpenNext16Yet
    ? `OpenNextJS Cloudflare is now supporting Next.js ${version}. It matches Vercel's latest release (${latestNextVersion}).`
    : `OpenNextJS Cloudflare is still on Next.js ${version}, while Vercel's latest is ${latestNextVersion}. Not yet supporting Next.js ${TARGET_VERSION}.`

  const siteUrl = BASE_URL

  return {
    meta: [
      {
        title: `Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}? ${status}`,
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
        content: `Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}? ${status}`,
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
        content: `OpenNextJS Cloudflare Next.js ${TARGET_VERSION} Status: ${status}`,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: `Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}? ${status}`,
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
