import { major, prerelease, rcompare } from 'semver'

interface NpmRegistryResponse {
  versions: Record<string, unknown>
}

/**
 * Fetches stable (non-prerelease) versions of a package from the npm registry,
 * sorted newest to oldest, down to (and including) the given major version.
 *
 * @param packageName - e.g. "next"
 * @param minMajor - lowest major version to include (e.g. 15 includes 15.x.x but stops before 14.x.x)
 * @returns array of version strings, newest first
 */
export async function getVersionsDownToMajor(
  packageName: string,
  minMajor: number,
): Promise<Array<string>> {
  const res = await fetch(`https://registry.npmjs.org/${packageName}`)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch package data: ${res.status} ${res.statusText}`,
    )
  }

  const data: NpmRegistryResponse = await res.json()

  const stableVersions = Object.keys(data.versions).filter(
    (v) => prerelease(v) === null,
  )

  stableVersions.sort(rcompare)

  const result: Array<string> = []
  for (const version of stableVersions) {
    if (major(version) < minMajor) break
    result.push(version)
  }

  return result
}
