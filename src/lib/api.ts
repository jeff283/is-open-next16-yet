import { packageJsonSchema } from './schemas'
import {
  PACKAGE_JSON_URL,
  GITHUB_ISSUE_URL,
  TARGET_VERSION,
  FALLBACK_ISSUE_DATE,
} from './constants'
import type { VersionInfo } from './types'

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

export const getDaysSinceIssueCreation = async (): Promise<number> => {
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

    if (!data.created_at || typeof data.created_at !== 'string') {
      throw new Error('Missing or invalid created_at field in issue data')
    }

    const createdAt = new Date(data.created_at)

    if (isNaN(createdAt.getTime())) {
      throw new Error(`Invalid date format: ${data.created_at}`)
    }

    const now = new Date()
    const daysSince = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (daysSince < 0) {
      throw new Error('Calculated days is negative (future date)')
    }

    return daysSince
  } catch (error) {
    console.error('Error fetching days since issue creation:', error)
    // Return fallback value - approximate based on issue creation date (Nov 4, 2024)
    const fallbackDate = new Date(FALLBACK_ISSUE_DATE)
    const now = new Date()
    const fallbackDays = Math.floor(
      (now.getTime() - fallbackDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    return fallbackDays > 0 ? fallbackDays : 0
  }
}
