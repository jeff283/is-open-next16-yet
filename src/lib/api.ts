import { z } from 'zod'
import type { VersionInfo } from '@/lib/types'
import {
  getMajorVersionNumber,
  npmPackageLatestSchema,
  packageJsonSchema,
  versionStringSchema,
} from '@/lib/schemas'
import {
  NEXT_LATEST_REGISTRY_URL,
  PACKAGE_JSON_URL,
  TARGET_VERSION,
} from '@/lib/constants'

export const getLatestNextVersion = async (): Promise<VersionInfo | null> => {
  const res = await fetch(NEXT_LATEST_REGISTRY_URL)
  if (!res.ok) {
    throw new Error(
      `Failed to fetch latest Next version: ${res.status} ${res.statusText}`,
    )
  }
  const data = await res.json()
  const parsed = npmPackageLatestSchema.parse(data)

  const majorVersion = getMajorVersionNumber(parsed.version)

  return {
    version: parsed.version,
    majorVersion,
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
      const majorVersion = getMajorVersionNumber(version)

      return {
        majorVersion,
        version,
      }
    } catch (error) {
      console.error('Error fetching OpenNextJS version:', error)
      return null
    }
  }

export const getOpenNextVersion = async (): Promise<{
  isOpenNext16Yet: boolean
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
    const versionNumber = getMajorVersionNumber(validatedVersion)

    return {
      isOpenNext16Yet: versionNumber >= TARGET_VERSION,
      versionNumber,
      version: validatedVersion,
    }
  } catch (error) {
    console.error('Error fetching OpenNextJS version:', error)
    return {
      isOpenNext16Yet: false,
      versionNumber: 15,
      version: '15.x.x (error loading)',
      error:
        error instanceof z.ZodError
          ? error.issues.map((issue) => issue.message).join(', ')
          : error instanceof Error
            ? error.message
            : 'Unknown error',
    }
  }
}
