import { z } from 'zod'
import type { IssueDates, VersionInfo } from '@/lib/types'
import {
  getMajorVersionNumber,
  githubIssueSchema,
  isoDateStringSchema,
  npmPackageLatestSchema,
  packageJsonSchema,
  versionStringSchema,
} from '@/lib/schemas'
import {
  GITHUB_ISSUE_URL,
  ISSUE_CREATED_AT,
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

      // Validate package.json structure with Zod
      const parsed = packageJsonSchema.parse(data)

      // Validate version string format with Zod
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

    // Validate package.json structure with Zod
    const parsed = packageJsonSchema.parse(data)

    // Validate version string format with Zod
    const validatedVersion = versionStringSchema.parse(parsed.dependencies.next)

    const versionNumber = getMajorVersionNumber(validatedVersion)

    return {
      isOpenNext16Yet: versionNumber >= TARGET_VERSION,
      versionNumber,
      version: validatedVersion,
    }
  } catch (error) {
    console.error('Error fetching OpenNextJS version:', error)
    // Return fallback values on error
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

const calculateDaysSince = (dateString: string | null): number | null => {
  if (!dateString) return null

  try {
    // Validate date string with Zod
    const validatedDate = isoDateStringSchema.parse(dateString)
    const date = new Date(validatedDate)

    const now = new Date()
    const daysSince = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    )

    return daysSince >= 0 ? daysSince : null
  } catch (error) {
    console.error(`Invalid date format: ${dateString}`, error)
    return null
  }
}

export const getIssueDates = async (): Promise<IssueDates> => {
  // Validate and calculate days since creation using the constant
  let validDaysSinceCreation = 0

  try {
    const validatedCreatedAt = isoDateStringSchema.parse(ISSUE_CREATED_AT)
    const createdAt = new Date(validatedCreatedAt)
    const now = new Date()
    const daysSinceCreation = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    )
    // If date is in the future, return 0 (shouldn't happen for creation dates)
    validDaysSinceCreation = daysSinceCreation >= 0 ? daysSinceCreation : 0
  } catch (error) {
    console.error(`Invalid creation date: ${ISSUE_CREATED_AT}`, error)
    throw new Error(
      `Invalid creation date format: ${ISSUE_CREATED_AT}. ${
        error instanceof z.ZodError
          ? error.issues.map((issue) => issue.message).join(', ')
          : 'Unknown error'
      }`,
    )
  }

  try {
    const response = await fetch(GITHUB_ISSUE_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'jeff283/is-open-next16-yet',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub issue: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    // Validate GitHub issue response with Zod
    const parsed = githubIssueSchema.parse(data)

    const updatedAt = parsed.updated_at || null
    const closedAt = parsed.closed_at || null
    const isClosed = !!closedAt

    return {
      daysSinceIssueCreation: validDaysSinceCreation,
      daysSinceIssueUpdate: calculateDaysSince(updatedAt),
      daysSinceIssueClose: calculateDaysSince(closedAt),
      isClosed,
    }
  } catch (error) {
    console.error('Error fetching issue dates:', error)
    // Return fallback values - we still have creation date from constant
    return {
      daysSinceIssueCreation: validDaysSinceCreation,
      daysSinceIssueUpdate: null,
      daysSinceIssueClose: null,
      isClosed: false,
    }
  }
}
