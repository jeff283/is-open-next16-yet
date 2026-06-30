import { z } from 'zod'
import { major, prerelease, rcompare } from 'semver'
import {
  packageJsonSchema,
  versionStringSchema,
} from '@/lib/schemas'
import { PACKAGE_JSON_URL } from '@/lib/constants'

interface NpmPackument {
  'dist-tags': { latest: string }
  versions: Record<string, unknown>
}

/**
 * Single abbreviated packument fetch — returns the latest Vercel Next.js
 * version and all stable versions sorted newest-first.
 * Using the install-v1 Accept header keeps the payload small (~10x lighter
 * than the full packument).
 */
export const getNextNpmData = async (): Promise<{
  latestVersion: string
  latestMajorVersion: number
  allStableVersions: Array<string>
} | null> => {
  try {
    const res = await fetch('https://registry.npmjs.org/next', {
      headers: { Accept: 'application/vnd.npm.install-v1+json' },
    })

    if (!res.ok) {
      throw new Error(`npm registry responded ${res.status} ${res.statusText}`)
    }

    const data: NpmPackument = await res.json()
    const latestVersion = data['dist-tags'].latest

    const allStableVersions = Object.keys(data.versions)
      .filter((v) => prerelease(v) === null)
      .sort(rcompare)

    return {
      latestVersion,
      latestMajorVersion: major(latestVersion),
      allStableVersions,
    }
  } catch (error) {
    console.error('Error fetching Next.js npm data:', error)
    return null
  }
}

export const getOpenNextVersion = async (): Promise<{
  versionNumber: number
  version: string
  error?: string
}> => {
  try {
    const response = await fetch(PACKAGE_JSON_URL, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'jeff283/is-open-next16-yet',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch package.json: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    const parsed = packageJsonSchema.parse(data)
    const validatedVersion = versionStringSchema.parse(parsed.dependencies.next)

    return {
      versionNumber: major(validatedVersion),
      version: validatedVersion,
    }
  } catch (error) {
    console.error('Error fetching OpenNextJS version:', error)
    return {
      versionNumber: 0,
      version: 'error',
      error:
        error instanceof z.ZodError
          ? error.issues.map((issue) => issue.message).join(', ')
          : error instanceof Error
            ? error.message
            : 'Unknown error',
    }
  }
}
