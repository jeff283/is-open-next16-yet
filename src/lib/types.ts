export interface VersionInfo {
  majorVersion: number
  version: string
  error?: string
}

export interface IssueDates {
  daysSinceIssueCreation: number
  daysSinceIssueUpdate: number | null
  daysSinceIssueClose: number | null
  isClosed: boolean
}

export interface LoaderData extends VersionInfo, IssueDates {}
