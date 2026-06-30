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
    (v) => !v.includes('-'), // exclude canary, preview, beta, rc, etc.
  )

  // Sort descending using semver-aware comparison
  stableVersions.sort((a, b) => compareSemver(b, a))

  // Stop once we drop below the requested major version
  const result: Array<string> = []
  for (const version of stableVersions) {
    const major = parseInt(version.split('.')[0], 10)
    if (major < minMajor) break
    result.push(version)
  }

  return result
}

/**
 * Basic semver comparator (assumes no prerelease tags, since we filter those out).
 * Returns positive if a > b, negative if a < b, 0 if equal.
 */
function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i]
  }
  return 0
}

// Example usage:
// getVersionsDownToMajor("next", 15).then(console.log);
