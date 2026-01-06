import { packageJsonSchema } from './schemas'
import {
  PACKAGE_JSON_URL,
  GITHUB_ISSUE_URL,
  TARGET_VERSION,
  ISSUE_CREATED_AT,
} from './constants'
import type { VersionInfo, IssueDates } from './types'

export const getOpenNextVersion = async (): Promise<VersionInfo> => {
  try {
    const response = await fetch(PACKAGE_JSON_URL, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch package.json: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: expected JSON object')
    }

    const parsed = packageJsonSchema.parse(data)
    const version = parsed.dependencies.next

    if (!version || typeof version !== 'string') {
      throw new Error('Invalid version format in package.json')
    }

    const versionNumber = parseInt(version.split('.')[0], 10)

    if (isNaN(versionNumber)) {
      throw new Error(`Could not parse version number from: ${version}`)
    }

    return {
      isOpenNext16Yet: versionNumber >= TARGET_VERSION,
      versionNumber,
      version,
    }
  } catch (error) {
    console.error('Error fetching OpenNextJS version:', error)
    // Return fallback values on error
    return {
      isOpenNext16Yet: false,
      versionNumber: 15,
      version: '15.x.x (error loading)',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const calculateDaysSince = (dateString: string | null): number | null => {
  if (!dateString) return null

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.error(`Invalid date format: ${dateString}`)
    return null
  }

  const now = new Date()
  const daysSince = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  )

  return daysSince >= 0 ? daysSince : null
}

export const getIssueDates = async (): Promise<IssueDates> => {
  // Calculate days since creation using the constant
  const createdAt = new Date(ISSUE_CREATED_AT)

  if (isNaN(createdAt.getTime())) {
    console.error(`Invalid creation date: ${ISSUE_CREATED_AT}`)
    throw new Error(`Invalid creation date format: ${ISSUE_CREATED_AT}`)
  }

  const now = new Date()
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  )

  // If date is in the future, return 0 (shouldn't happen for creation dates)
  const validDaysSinceCreation = daysSinceCreation >= 0 ? daysSinceCreation : 0

  try {
    const response = await fetch(GITHUB_ISSUE_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub issue: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: expected JSON object')
    }

    const updatedAt = data.updated_at || null
    const closedAt = data.closed_at || null
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
