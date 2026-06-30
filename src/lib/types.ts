export interface VersionInfo {
  majorVersion: number
  version: string
  error?: string
}

export interface LoaderData {
  isOpenNext16Yet: boolean
  versionNumber: number
  version: string
  latestNextVersion: string
  latestNextMajorVersion: number
  error?: string
}
