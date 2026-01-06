import { BASE_URL, SITE_NAME, TWITTER_HANDLE } from './constants'
import type { LoaderData } from './types'

export const generateHomePageMeta = (data: LoaderData | undefined) => {
  const fallbackData: LoaderData = {
    isOpenNext16Yet: false,
    versionNumber: 15,
    version: '15.x.x',
    daysSinceIssueCreation: 0,
  }

  const {
    isOpenNext16Yet,
    version,
    daysSinceIssueCreation,
  } = data ?? fallbackData

  const status = isOpenNext16Yet ? 'YES' : 'NO'
  const description = isOpenNext16Yet
    ? `OpenNextJS Cloudflare is now using Next.js ${version}! 🎉`
    : `OpenNextJS Cloudflare is still NOT using Next.js 16. It's been ${daysSinceIssueCreation} days since the issue was created. Currently using Next.js ${version}.`

  const siteUrl = BASE_URL

  return {
    meta: [
      {
        title: `Is OpenNextJS Cloudflare Using Next.js 16? ${status}`,
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
      // Open Graph tags
      {
        property: 'og:title',
        content: `Is OpenNextJS Cloudflare Using Next.js 16? ${status}`,
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
        content: `${BASE_URL}/og-image.png`, // Create a 1200x630px image for social previews
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
        content: `OpenNextJS Cloudflare Next.js 16 Status: ${status}`,
      },
      // Twitter Card tags
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: `Is OpenNextJS Cloudflare Using Next.js 16? ${status}`,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: `${BASE_URL}/og-image.png`, // Create a 1200x630px image for social previews
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
