import { Link, createFileRoute } from '@tanstack/react-router'
import { gte } from 'semver'
import type { LoaderData } from '@/lib/types'
import { getNextNpmData, getOpenNextVersion } from '@/lib/api'
import { generateHomePageMeta } from '@/lib/seo'

export const Route = createFileRoute('/')({
  // Both fetches run in parallel — one GitHub call, one npm call
  loader: async (): Promise<LoaderData> => {
    try {
      const [openNext, nextNpm] = await Promise.all([
        getOpenNextVersion(),
        getNextNpmData(),
      ])

      const vercelVersionHistory = nextNpm
        ? nextNpm.allStableVersions.filter((v) => gte(v, openNext.version))
        : []

      return {
        ...openNext,
        latestNextVersion: nextNpm?.latestVersion ?? 'unknown',
        latestNextMajorVersion: nextNpm?.latestMajorVersion ?? 0,
        vercelVersionHistory,
      }
    } catch (error) {
      console.error('Error in loader:', error)
      return {
        versionNumber: 0,
        version: 'error',
        latestNextVersion: 'error',
        latestNextMajorVersion: 0,
        vercelVersionHistory: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
  // Cache loader result on the client — avoids refetch on every back-navigation
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData }) => generateHomePageMeta(loaderData),
  pendingComponent: PageSkeleton,
  component: App,
})

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-sm ${className ?? ''}`} />
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">

        {/* Full Version card skeleton */}
        <div className="border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black px-6 py-3">
            <SkeletonBlock className="h-3 w-24 bg-gray-600" />
          </div>
          <div className="grid grid-cols-2 divide-x-4 divide-black">
            {[0, 1].map((i) => (
              <div key={i} className="p-5 bg-white text-center space-y-2">
                <SkeletonBlock className="h-2 w-20 mx-auto" />
                <SkeletonBlock className="h-6 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Version history table skeleton */}
        <div className="border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="grid grid-cols-2 divide-x-4 divide-white bg-black">
            {[0, 1].map((i) => (
              <div key={i} className="px-6 py-3">
                <SkeletonBlock className="h-2 w-20 bg-gray-600" />
              </div>
            ))}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x-2 divide-black border-t-2 border-black"
            >
              <div className="px-6 py-3">
                <SkeletonBlock className="h-4 w-16" />
              </div>
              <div className="px-6 py-3" />
            </div>
          ))}
        </div>

        {/* Match status card skeleton */}
        <div className="border-4 border-black p-5 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-100 text-center space-y-2">
          <SkeletonBlock className="h-2 w-24 mx-auto" />
          <SkeletonBlock className="h-8 w-32 mx-auto" />
        </div>

        <div className="text-center">
          <SkeletonBlock className="h-2 w-10 mx-auto" />
        </div>
      </div>
    </div>
  )
}

// ─── Shared display helpers ───────────────────────────────────────────────────

function VersionDisplay({ version }: { version: string }) {
  const parts = version.split('.')
  const prefix = parts.slice(0, -1).join('.') + '.'
  const patch = parts.at(-1) ?? version
  return (
    <p className="text-xl font-black text-black font-mono">
      <span className="opacity-40">{prefix}</span>
      <span>{patch}</span>
    </p>
  )
}

// ─── Available for future use ─────────────────────────────────────────────────

export function MajorVersionCard({
  latestNextMajorVersion,
  versionNumber,
}: {
  latestNextMajorVersion: number
  versionNumber: number
}) {
  return (
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
          <p className="text-4xl font-black text-black">{latestNextMajorVersion}</p>
        </div>
        <div className="p-5 bg-white text-center">
          <p className="text-xs font-black uppercase tracking-widest text-black mb-2">
            OpenNextJS CF
          </p>
          <p className="text-4xl font-black text-black">{versionNumber}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Version history list ─────────────────────────────────────────────────────

type DisplayRow =
  | { type: 'version'; value: string }
  | { type: 'separator'; count: number }

function buildRows(versions: Array<string>): Array<DisplayRow> {
  if (versions.length <= 6) {
    return versions.map((v) => ({ type: 'version', value: v }))
  }
  const top = versions.slice(0, 3)
  const bottom = versions.slice(-3)
  const count = versions.length - 6
  return [
    ...top.map((v) => ({ type: 'version' as const, value: v })),
    { type: 'separator' as const, count },
    ...bottom.map((v) => ({ type: 'version' as const, value: v })),
  ]
}

function VersionHistoryList({
  versions,
  openNextVersion,
}: {
  versions: Array<string>
  openNextVersion: string
}) {
  if (versions.length === 0) return null

  const rows = buildRows(versions)
  const firstVersion = versions.at(0)
  const lastVersion = versions.at(-1)

  return (
    <div className="border-4 border-black mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="grid grid-cols-2 divide-x-4 divide-white bg-black">
        <div className="px-6 py-3">
          <p className="text-white font-black uppercase tracking-widest text-xs">
            Vercel Next.js
          </p>
        </div>
        <div className="px-6 py-3">
          <p className="text-white font-black uppercase tracking-widest text-xs">
            OpenNextJS CF
          </p>
        </div>
      </div>

      {rows.map((row) => {
        if (row.type === 'separator') {
          return (
            <div
              key="sep"
              className="border-t-2 border-black bg-gray-100 py-2 text-center"
            >
              <p className="text-xs font-black text-black uppercase tracking-wide">
                {row.count} versions not shown
              </p>
            </div>
          )
        }

        const isLatestVercel = row.value === firstVersion
        const isOpenNext = row.value === lastVersion

        const rowBg = isLatestVercel
          ? 'bg-green-100'
          : isOpenNext
            ? 'bg-orange-100'
            : 'bg-white'

        return (
          <div
            key={row.value}
            className={`grid grid-cols-2 divide-x-2 divide-black border-t-2 border-black ${rowBg}`}
          >
            <div className="px-6 py-3">
              <p className="font-mono text-sm font-bold text-black">{row.value}</p>
            </div>
            <div className="px-6 py-3">
              {isOpenNext && (
                <p className="font-mono text-sm font-bold text-black">
                  {openNextVersion}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function App() {
  const {
    versionNumber,
    version,
    latestNextVersion,
    latestNextMajorVersion,
    vercelVersionHistory,
    error,
  } = Route.useLoaderData()

  const exactMatch = version === latestNextVersion
  const majorMatch = versionNumber === latestNextMajorVersion

  const statusBg = exactMatch
    ? 'bg-green-300'
    : majorMatch
      ? 'bg-orange-300'
      : 'bg-red-300'

  const statusLabel = exactMatch ? 'Exact match' : majorMatch ? 'Close' : 'Behind'

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
              <VersionDisplay version={latestNextVersion} />
            </div>
            <div className="p-5 bg-white text-center">
              <p className="text-xs font-black uppercase tracking-widest text-black mb-2">
                OpenNextJS CF
              </p>
              <VersionDisplay version={version} />
            </div>
          </div>
        </div>

        {/* Version history — only when versions differ */}
        {!exactMatch && (
          <VersionHistoryList
            versions={vercelVersionHistory}
            openNextVersion={version}
          />
        )}

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
