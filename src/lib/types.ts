export interface VersionInfo {
  majorVersion: number
  version: string
  error?: string
}

export interface LoaderData {
  versionNumber: number
  version: string
  latestNextVersion: string
  latestNextMajorVersion: number
  vercelVersionHistory: Array<string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  error?: string
}
