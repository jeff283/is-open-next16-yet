import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

const packageJsonSchema = z.object({
  dependencies: z.object({
    next: z.string(),
  }),
})

const packageJsonUrl =
  'https://raw.githubusercontent.com/opennextjs/opennextjs-cloudflare/refs/heads/main/create-cloudflare/next/package.json'

// Next js 16 and above
const targetVersion = 16

const getOpenNextVersion = async () => {
  try {
    const response = await fetch(packageJsonUrl, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch package.json: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: expected JSON object')
    }

    const parsed = packageJsonSchema.parse(data)
    const version = parsed.dependencies.next

    if (!version || typeof version !== 'string') {
      throw new Error('Invalid version format in package.json')
    }

    const versionNumber = parseInt(version.split('.')[0], 10)

    if (isNaN(versionNumber)) {
      throw new Error(`Could not parse version number from: ${version}`)
    }

    return {
      isOpenNext16Yet: versionNumber >= targetVersion,
      versionNumber,
      version,
    }
  } catch (error) {
    console.error('Error fetching OpenNextJS version:', error)
    // Return fallback values on error
    return {
      isOpenNext16Yet: false,
      versionNumber: 15,
      version: '15.x.x (error loading)',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const issueLink =
  'https://api.github.com/repos/opennextjs/opennextjs-cloudflare/issues/972'
const getDaysSinceIssueCreation = async () => {
  try {
    const response = await fetch(issueLink, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub issue: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: expected JSON object')
    }

    if (!data.created_at || typeof data.created_at !== 'string') {
      throw new Error('Missing or invalid created_at field in issue data')
    }

    const createdAt = new Date(data.created_at)

    if (isNaN(createdAt.getTime())) {
      throw new Error(`Invalid date format: ${data.created_at}`)
    }

    const now = new Date()
    const daysSince = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (daysSince < 0) {
      throw new Error('Calculated days is negative (future date)')
    }

    return daysSince
  } catch (error) {
    console.error('Error fetching days since issue creation:', error)
    // Return fallback value - approximate based on issue creation date (Nov 4, 2024)
    const fallbackDate = new Date('2024-11-04')
    const now = new Date()
    const fallbackDays = Math.floor(
      (now.getTime() - fallbackDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    return fallbackDays > 0 ? fallbackDays : 0
  }
}
export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      const [openNextVersion, daysSinceIssueCreation] = await Promise.all([
        getOpenNextVersion(),
        getDaysSinceIssueCreation(),
      ])

      return {
        ...openNextVersion,
        daysSinceIssueCreation,
      }
    } catch (error) {
      console.error('Error in loader:', error)
      // Return fallback values if loader fails completely
      return {
        isOpenNext16Yet: false,
        versionNumber: 15,
        version: '15.x.x (error loading)',
        daysSinceIssueCreation: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData ?? {
      isOpenNext16Yet: false,
      versionNumber: 15,
      version: '15.x.x',
      daysSinceIssueCreation: 0,
    }
    const { isOpenNext16Yet, version, daysSinceIssueCreation } = data
    const status = isOpenNext16Yet ? 'YES' : 'NO'
    const description = isOpenNext16Yet
      ? `OpenNextJS Cloudflare is now using Next.js ${version}! 🎉`
      : `OpenNextJS Cloudflare is still NOT using Next.js 16. It's been ${daysSinceIssueCreation} days since the issue was created. Currently using Next.js ${version}.`

    // Base URL - update this when you deploy
    // const baseUrl = 'https://is-open-next16-yet.pages.dev' // Update with your actual domain
    const baseUrl = 'http://localhost:3000' // Update with your actual domain
    const siteUrl = baseUrl

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
          content: 'Is Open Next 16 Yet?',
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
        {
          name: 'twitter:creator',
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
  component: App,
})

function App() {
  const {
    isOpenNext16Yet,
    versionNumber,
    version,
    daysSinceIssueCreation,
    error,
  } = Route.useLoaderData()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        {/* Error Banner */}
        {error && (
          <div className="border-4 border-black p-4 mb-4 bg-yellow-100">
            <p className="text-sm font-bold text-black">
              ⚠️ Unable to fetch latest data. Showing cached/fallback values.
            </p>
          </div>
        )}

        {/* Main Status Card */}
        <div
          className={`border-4 border-black p-8 mb-6 ${
            isOpenNext16Yet ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <div className="text-center">
            <h1
              className={`font-black mb-4 text-black ${
                isOpenNext16Yet ? 'text-6xl' : 'text-9xl'
              }`}
            >
              {isOpenNext16Yet ? 'YES' : 'NO'}
            </h1>
            <p className="text-2xl font-bold text-black mb-2">
              OpenNextJS Cloudflare
            </p>
            <p className="text-xl font-semibold text-black">
              {isOpenNext16Yet
                ? 'is using Next.js 16'
                : 'is NOT using Next.js 16 yet'}
            </p>
          </div>
        </div>

        {/* Version Info Card */}
        <div className="border-4 border-black p-6 bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="text-lg font-bold text-black">
                Current Version:
              </span>
              <span className="text-xl font-black text-black">{version}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="text-lg font-bold text-black">
                Major Version:
              </span>
              <span className="text-xl font-black text-black">
                {versionNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-black">
                Target Version:
              </span>
              <span className="text-xl font-black text-black">
                {targetVersion}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold text-black">
            Next.js 16 introduces many new features
          </p>
          <p className="text-xs text-black mt-1">
            It's been {daysSinceIssueCreation} days since the issue was created
            and still no Next.js 16 support
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/about"
            className="text-xs text-black underline hover:no-underline"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  )
}
