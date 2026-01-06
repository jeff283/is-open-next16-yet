import { createFileRoute } from '@tanstack/react-router'
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
  const response = await fetch(packageJsonUrl)
  const data = await response.json()
  const parsed = packageJsonSchema.parse(data)
  const version = parsed.dependencies.next
  const versionNumber = parseInt(version.split('.')[0], 10)
  const responseData = {
    isOpenNext16Yet: versionNumber >= targetVersion,
    versionNumber,
    version,
  }
  return responseData
}
export const Route = createFileRoute('/')({
  loader: () => getOpenNextVersion(),
  component: App,
})

function App() {
  const { isOpenNext16Yet, versionNumber, version } = Route.useLoaderData()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        {/* Main Status Card */}
        <div
          className={`border-4 border-black p-8 mb-6 ${
            isOpenNext16Yet ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <div className="text-center">
            <h1 className="text-6xl font-black mb-4 text-black">
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
            It's been 4 months and still no Next.js 16 support
          </p>
        </div>
      </div>
    </div>
  )
}
