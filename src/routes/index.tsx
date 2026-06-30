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
    isOpenNext16Yet,
    versionNumber,
    version,
    latestNextVersion,
    latestNextMajorVersion,
    error,
  } = Route.useLoaderData()

  const versionGap = latestNextMajorVersion - versionNumber

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

        {/* Hero Card */}
        <div
          className={`border-4 border-black p-8 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
            isOpenNext16Yet ? 'bg-green-300' : 'bg-red-300'
          }`}
        >
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest text-black mb-2">
              Is OpenNextJS Cloudflare
            </p>
            <h1 className="text-9xl font-black text-black leading-none mb-2">
              {isOpenNext16Yet ? 'YES' : 'NO'}
            </h1>
            <p className="text-xl font-black text-black">
              {isOpenNext16Yet
                ? `supporting Next.js ${TARGET_VERSION}?`
                : `supporting Next.js ${TARGET_VERSION} yet?`}
            </p>
          </div>
        </div>

        {/* Version Comparison Card */}
        <div className="border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black px-6 py-3">
            <p className="text-white font-black uppercase tracking-widest text-sm">
              Version Comparison
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x-4 divide-black">
            {/* Vercel / npm */}
            <div className="p-6 bg-blue-100">
              <p className="text-xs font-black uppercase tracking-widest text-black mb-3">
                Vercel Next.js
              </p>
              <p className="text-5xl font-black text-black leading-none">
                v{latestNextMajorVersion}
              </p>
              <p className="text-sm font-bold text-black mt-2 font-mono">
                {latestNextVersion}
              </p>
              <div className="mt-4 inline-block bg-black px-2 py-1">
                <p className="text-xs font-black text-white uppercase">Latest</p>
              </div>
            </div>

            {/* OpenNextJS Cloudflare */}
            <div className={`p-6 ${isOpenNext16Yet ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="text-xs font-black uppercase tracking-widest text-black mb-3">
                OpenNextJS CF
              </p>
              <p className="text-5xl font-black text-black leading-none">
                v{versionNumber}
              </p>
              <p className="text-sm font-bold text-black mt-2 font-mono">
                {version}
              </p>
              <div className={`mt-4 inline-block px-2 py-1 border-2 border-black ${isOpenNext16Yet ? 'bg-green-300' : 'bg-red-300'}`}>
                <p className="text-xs font-black text-black uppercase">
                  {isOpenNext16Yet ? 'Up to date' : `${versionGap} behind`}
                </p>
              </div>
            </div>
          </div>

          {/* Gap Indicator */}
          {!isOpenNext16Yet && (
            <div className="border-t-4 border-black bg-yellow-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-black uppercase tracking-wide">
                  Version gap
                </span>
                <span className="text-2xl font-black text-black">
                  {versionGap} major {versionGap === 1 ? 'version' : 'versions'} behind
                </span>
              </div>
            </div>
          )}
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
