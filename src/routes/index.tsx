import { Link, createFileRoute } from '@tanstack/react-router'
import type { LoaderData } from '@/lib/types'
import {
  getLatestNextVersion,
  getOpenNextVersion,
  getVercelVersionsSinceOpenNext,
} from '@/lib/api'
import { generateHomePageMeta } from '@/lib/seo'
import { TARGET_VERSION } from '@/lib/constants'

export const Route = createFileRoute('/')({
  loader: async (): Promise<LoaderData> => {
    try {
      const [openNextVersion, latestNext] = await Promise.all([
        getOpenNextVersion(),
        getLatestNextVersion(),
      ])

      const vercelVersionHistory = await getVercelVersionsSinceOpenNext(
        openNextVersion.versionNumber,
        openNextVersion.version,
      )

      return {
        ...openNextVersion,
        latestNextVersion: latestNext?.version ?? 'unknown',
        latestNextMajorVersion: latestNext?.majorVersion ?? TARGET_VERSION,
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
  head: ({ loaderData }) => {
    return generateHomePageMeta(loaderData)
  },
  component: App,
})

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

// ─── Unused (available for future use) ───────────────────────────────────────

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
  const { versionNumber, version, latestNextVersion, latestNextMajorVersion, vercelVersionHistory, error } =
    Route.useLoaderData()

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
