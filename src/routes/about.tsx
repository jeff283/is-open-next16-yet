import { Link, createFileRoute } from '@tanstack/react-router'
import { BASE_URL, SITE_NAME, TARGET_VERSION, TWITTER_HANDLE } from '@/lib/constants'

export const Route = createFileRoute('/about')({
  head: () => {
    const siteUrl = `${BASE_URL}/about`

    return {
      meta: [
        {
          title: `About - Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}?`,
        },
        {
          name: 'description',
          content:
            `A quick way to check whether OpenNextJS Cloudflare supports the same Next.js version as Vercel's latest stable release.`,
        },
        {
          name: 'keywords',
          content:
            'OpenNextJS, Cloudflare, Next.js, Vercel, version comparison, Next.js support, Cloudflare Workers',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          property: 'og:title',
          content: `About - Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}?`,
        },
        {
          property: 'og:description',
          content: `Check whether OpenNextJS Cloudflare supports the same Next.js version as Vercel's latest stable release.`,
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
          content: `About - Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}?`,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: `About - Is OpenNextJS Cloudflare Using Next.js ${TARGET_VERSION}?`,
        },
        {
          name: 'twitter:description',
          content: `Check whether OpenNextJS Cloudflare supports the same Next.js version as Vercel's latest stable release.`,
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
      ],
      links: [
        {
          rel: 'canonical',
          href: siteUrl,
        },
      ],
    }
  },
  component: About,
})

function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-3xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block border-4 border-black px-6 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="border-4 border-black p-8 bg-white mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-5xl font-black mb-6 text-black">About</h1>

          <div className="space-y-6 text-black">
            <div>
              <h2 className="text-2xl font-black mb-3">What This Is</h2>
              <p className="text-lg leading-relaxed">
                A personal utility, and hopefully useful to other devs too,
                that answers one question: does the Next.js version that{' '}
                <a
                  href="https://github.com/opennextjs/opennextjs-cloudflare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                >
                  OpenNextJS Cloudflare
                </a>{' '}
                supports match the latest stable Next.js release from Vercel?
                No more, no less.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-3">How It Works</h2>
              <div className="space-y-3">
                <div className="border-2 border-black p-4 bg-blue-100">
                  <p className="font-black text-sm uppercase tracking-wide mb-1">Vercel Next.js</p>
                  <p className="text-base leading-relaxed">
                    Fetched live from the npm registry at{' '}
                    <code className="font-mono bg-white border border-black px-1">
                      registry.npmjs.org/next/latest
                    </code>
                    . This is the latest stable version Vercel has published.
                  </p>
                </div>
                <div className="border-2 border-black p-4 bg-red-100">
                  <p className="font-black text-sm uppercase tracking-wide mb-1">OpenNextJS CF</p>
                  <p className="text-base leading-relaxed">
                    Fetched live from the{' '}
                    <code className="font-mono bg-white border border-black px-1">
                      package.json
                    </code>{' '}
                    in the{' '}
                    <a
                      href="https://github.com/opennextjs/opennextjs-cloudflare"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline"
                    >
                      opennextjs-cloudflare
                    </a>{' '}
                    repository. The{' '}
                    <code className="font-mono bg-white border border-black px-1">next</code>{' '}
                    dependency version there reflects what they currently support.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-3">Why I Built It</h2>
              <p className="text-lg leading-relaxed">
                When choosing whether to use a new Next.js feature in a
                Cloudflare-deployed app, I kept having to manually check both
                repos to see if the versions lined up. This automates that
                check. The OpenNextJS team does great work. This is just a
                convenience tool to save a browser tab or two.
              </p>
            </div>
          </div>
        </div>

        {/* Links Card */}
        <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-4 text-black">Links</h2>
          <div className="space-y-3">
            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black px-4 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              Next.js on GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/next"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black px-4 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              Next.js on npm
            </a>
            <a
              href="https://github.com/opennextjs/opennextjs-cloudflare"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black px-4 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              OpenNextJS Cloudflare on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
