import { Link, createFileRoute } from '@tanstack/react-router'
import type { LoaderData } from '@/lib/types'
import { getLatestNextVersion, getOpenNextVersion } from '@/lib/api'
import { generateHomePageMeta } from '@/lib/seo'
import { TARGET_VERSION } from '@/lib/constants'

export const Route = createFileRoute('/')({
  loader: async (): Promise<LoaderData> => {
    try {
      const [openNextVersion, latestNext] = await Promise.all([
        getOpenNextVersion(),
        getLatestNextVersion(),
      ])

      return {
        ...openNextVersion,
        latestNextVersion: latestNext?.version ?? 'unknown',
        latestNextMajorVersion: latestNext?.majorVersion ?? TARGET_VERSION,
      }
    } catch (error) {
      console.error('Error in loader:', error)
      return {
        isOpenNext16Yet: false,
        versionNumber: 15,
        version: '15.x.x (error loading)',
        latestNextVersion: `${TARGET_VERSION}.x.x (error loading)`,
        latestNextMajorVersion: TARGET_VERSION,
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
    versionNumber,
    version,
    latestNextVersion,
    latestNextMajorVersion,
    error,
  } = Route.useLoaderData()

  const exactMatch = version === latestNextVersion
  const majorMatch = versionNumber === latestNextMajorVersion

  const statusBg = exactMatch
    ? 'bg-green-300'
    : majorMatch
      ? 'bg-orange-300'
      : 'bg-red-300'

  const statusLabel = exactMatch
    ? 'Exact match'
    : majorMatch
      ? 'Close'
      : 'Behind'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        {error && (
          <div className="border-4 border-black p-4 mb-4 bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-bold text-black">
              Unable to fetch latest data. Showing cached/fallback values.
            </p>
          </div>
        )}

        {/* Full Version Comparison */}
        <div className="border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black px-6 py-3">
            <p className="text-white font-black uppercase tracking-widest text-sm">
              Full Version
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x-4 divide-black">
            <div className="p-5 bg-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-black mb-2">
                Vercel Next.js
              </p>
              <p className="text-xl font-black text-black font-mono">
                {latestNextVersion}
              </p>
            </div>
            <div className="p-5 bg-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-black mb-2">
                OpenNextJS CF
              </p>
              <p className="text-xl font-black text-black font-mono">
                {version}
              </p>
            </div>
          </div>
        </div>

        {/* Major Version Comparison */}
        <div className="border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black px-6 py-3">
            <p className="text-white font-black uppercase tracking-widest text-sm">
              Major Version
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x-4 divide-black">
            <div className="p-5 bg-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-black mb-2">
                Vercel Next.js
              </p>
              <p className="text-4xl font-black text-black">
                {latestNextMajorVersion}
              </p>
            </div>
            <div className="p-5 bg-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-black mb-2">
                OpenNextJS CF
              </p>
              <p className="text-4xl font-black text-black">
                {versionNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Match Status */}
        <div
          className={`border-4 border-black p-5 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center ${statusBg}`}
        >
          <p className="text-xs font-black uppercase tracking-widest text-black mb-1">
            Match Status
          </p>
          <p className="text-3xl font-black text-black">{statusLabel}</p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            to="/about"
            className="text-xs font-black text-black underline hover:no-underline uppercase tracking-widest"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  )
}
