import { createFileRoute, Link } from '@tanstack/react-router'
import { getOpenNextVersion, getIssueDates } from '@/lib/api'
import { generateHomePageMeta } from '@/lib/seo'
import { TARGET_VERSION } from '@/lib/constants'
import type { LoaderData } from '@/lib/types'

export const Route = createFileRoute('/')({
  loader: async (): Promise<LoaderData> => {
    try {
      const [openNextVersion, issueDates] = await Promise.all([
        getOpenNextVersion(),
        getIssueDates(),
      ])

      return {
        ...openNextVersion,
        ...issueDates,
      }
    } catch (error) {
      console.error('Error in loader:', error)
      // Return fallback values if loader fails completely
      return {
        isOpenNext16Yet: false,
        versionNumber: 15,
        version: '15.x.x (error loading)',
        daysSinceIssueCreation: 0,
        daysSinceIssueUpdate: null,
        daysSinceIssueClose: null,
        isClosed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
  head: ({ loaderData }) => {
    return generateHomePageMeta(loaderData)
  },
  component: App,
})

function App() {
  const {
    isOpenNext16Yet,
    versionNumber,
    version,
    daysSinceIssueCreation,
    daysSinceIssueUpdate,
    daysSinceIssueClose,
    isClosed,
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
                {TARGET_VERSION}
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
            {daysSinceIssueUpdate !== null &&
              ` and ${daysSinceIssueUpdate} days since last update`}
            {isClosed && daysSinceIssueClose !== null
              ? ` (closed ${daysSinceIssueClose} days ago)`
              : ' and still no Next.js 16 support'}
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
