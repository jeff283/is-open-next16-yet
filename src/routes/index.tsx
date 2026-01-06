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
    <div>
      <h1>Open Next 16 Yet? {isOpenNext16Yet ? 'Yes' : 'No'}</h1>
      <p>Version: {versionNumber}</p>
      <p>Version: {version}</p>
      <p>Target Version: {targetVersion}</p>
    </div>
  )
}
