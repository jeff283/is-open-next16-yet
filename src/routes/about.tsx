import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  head: () => {
    // const baseUrl = 'https://is-open-next16-yet.pages.dev' // Update with your actual domain
    const baseUrl = 'http://localhost:3000' // Update with your actual domain
    const siteUrl = `${baseUrl}/about`

    return {
      meta: [
        {
          title: 'About - Is OpenNextJS Cloudflare Using Next.js 16?',
        },
        {
          name: 'description',
          content:
            'Learn why this app was created and why OpenNextJS Cloudflare support for Next.js 16 matters. Check the status of GitHub Issue #972.',
        },
        {
          name: 'keywords',
          content:
            'OpenNextJS, Cloudflare, Next.js 16, GitHub Issue 972, Next.js support, React, Cloudflare Workers',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        // Open Graph tags
        {
          property: 'og:title',
          content: 'About - Is OpenNextJS Cloudflare Using Next.js 16?',
        },
        {
          property: 'og:description',
          content:
            'Learn why this app was created and why OpenNextJS Cloudflare support for Next.js 16 matters.',
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
          content: 'Is Open Next 16 Yet?',
        },
        {
          property: 'og:locale',
          content: 'en_US',
        },
        {
          property: 'og:image',
          content: `${baseUrl}/og-image.png`, // Create a 1200x630px image for social previews
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
          content: 'About - Is OpenNextJS Cloudflare Using Next.js 16?',
        },
        // Twitter Card tags
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: 'About - Is OpenNextJS Cloudflare Using Next.js 16?',
        },
        {
          name: 'twitter:description',
          content:
            'Learn why this app was created and why OpenNextJS Cloudflare support for Next.js 16 matters.',
        },
        {
          name: 'twitter:image',
          content: `${baseUrl}/og-image.png`, // Create a 1200x630px image for social previews
        },
        {
          name: 'twitter:url',
          content: siteUrl,
        },
        {
          name: 'twitter:site',
          content: '@opennextjs', // Update if you have a Twitter handle
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
            className="inline-block border-4 border-black px-6 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="border-4 border-black p-8 bg-white mb-6">
          <h1 className="text-5xl font-black mb-6 text-black">About</h1>

          <div className="space-y-6 text-black">
            <div>
              <h2 className="text-2xl font-black mb-3">Why This App Exists</h2>
              <p className="text-lg leading-relaxed">
                Next.js 16 was released with groundbreaking new features
                including Cache Components, improved performance, and enhanced
                developer experience. However, developers using{' '}
                <a
                  href="https://github.com/opennextjs/opennextjs-cloudflare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                >
                  OpenNextJS Cloudflare
                </a>{' '}
                have been waiting months for Next.js 16 support.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-3">The Problem</h2>
              <p className="text-lg leading-relaxed">
                On November 4, 2024, a GitHub issue was opened requesting
                Next.js 16 support (
                <a
                  href="https://github.com/opennextjs/opennextjs-cloudflare/issues/972"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                >
                  Issue #972
                </a>
                ). The issue has received significant community support with 71+
                👍 reactions and 32 ❤️ reactions, showing strong demand for this
                feature.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-3">What's Missing</h2>
              <p className="text-lg leading-relaxed mb-3">
                According to the issue, the following features need to be
                implemented:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="font-black mr-2">•</span>
                  <span>OpenTelemetry support</span>
                </li>
                <li className="flex items-start">
                  <span className="font-black mr-2">•</span>
                  <span>Turbopack (released in Next.js 1.12)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-black mr-2">•</span>
                  <span>Proxy support with Adapters API (Next 16+)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-black mr-2">•</span>
                  <span>Next.js 16.1 support</span>
                </li>
                <li className="flex items-start">
                  <span className="font-black mr-2">•</span>
                  <span>Composable cache support</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-3">This App</h2>
              <p className="text-lg leading-relaxed">
                This app was created to provide a simple, clear answer to the
                question: "Is OpenNextJS Cloudflare using Next.js 16 yet?" It
                automatically checks the latest version from their repository
                and displays the current status, along with how long the
                community has been waiting for this support.
              </p>
            </div>
          </div>
        </div>

        {/* Links Card */}
        <div className="border-4 border-black p-6 bg-white">
          <h2 className="text-2xl font-black mb-4 text-black">Links</h2>
          <div className="space-y-3">
            <a
              href="https://github.com/opennextjs/opennextjs-cloudflare/issues/972"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black px-4 py-2 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
            >
              GitHub Issue #972
            </a>
            <a
              href="https://github.com/opennextjs/opennextjs-cloudflare"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black px-4 py-2 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
            >
              OpenNextJS Cloudflare Repository
            </a>
            <a
              href="https://nextjs.org/blog/next-16"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black px-4 py-2 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
            >
              Next.js 16 Release Notes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
