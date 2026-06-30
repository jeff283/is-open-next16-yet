import { z } from 'zod'
import { gte, major } from 'semver'
import type { VersionInfo } from '@/lib/types'
import {
  npmPackageLatestSchema,
  packageJsonSchema,
  versionStringSchema,
} from '@/lib/schemas'
import {
  NEXT_LATEST_REGISTRY_URL,
  PACKAGE_JSON_URL,
} from '@/lib/constants'
import { getVersionsDownToMajor } from '@/lib/lib'

export const getLatestNextVersion = async (): Promise<VersionInfo | null> => {
  const res = await fetch(NEXT_LATEST_REGISTRY_URL)
  if (!res.ok) {
    throw new Error(
      `Failed to fetch latest Next version: ${res.status} ${res.statusText}`,
    )
  }
  const data = await res.json()
  const parsed = npmPackageLatestSchema.parse(data)

  return {
    version: parsed.version,
    majorVersion: major(parsed.version),
  }
}

export const getLatestOpenNextVersion =
  async (): Promise<VersionInfo | null> => {
    try {
      const res = await fetch(PACKAGE_JSON_URL, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'jeff283/is-open-next16-yet',
        },
      })

      if (!res.ok) {
        throw new Error(
          `Failed to fetch package.json: ${res.status} ${res.statusText}`,
        )
      }

      const data = await res.json()
      const parsed = packageJsonSchema.parse(data)
      const version = versionStringSchema.parse(parsed.dependencies.next)

      return {
        majorVersion: major(version),
        version,
      }
    } catch (error) {
      console.error('Error fetching OpenNextJS version:', error)
      return null
    }
  }

/**
 * Returns all stable Vercel Next.js versions from the latest down to
 * (and including) the exact version OpenNextJS currently supports.
 */
export const getVercelVersionsSinceOpenNext = async (
  openNextMajorVersion: number,
  openNextFullVersion: string,
): Promise<Array<string>> => {
  try {
    const all = await getVersionsDownToMajor('next', openNextMajorVersion)
    return all.filter((v) => gte(v, openNextFullVersion))
  } catch (error) {
    console.error('Error fetching Vercel Next.js version history:', error)
    return []
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
