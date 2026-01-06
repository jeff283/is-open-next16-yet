export interface VersionInfo {
  isOpenNext16Yet: boolean
  versionNumber: number
  version: string
  error?: string
}

export interface LoaderData extends VersionInfo {
  daysSinceIssueCreation: number
}
