export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export const PACKAGE_MANAGERS: Array<PackageManager> = [
  'pnpm',
  'npm',
  'yarn',
  'bun',
]

/** Runtime packages we surface for upgrade commands. */
const RUNTIME_PACKAGES = [
  '@opennextjs/cloudflare',
  'next',
  'react',
  'react-dom',
] as const

/** Matching type packages only — skip tooling like tailwind/eslint/wrangler. */
const TYPE_PACKAGES = ['@types/react', '@types/react-dom'] as const

function pickPackages(
  source: Record<string, string>,
  names: ReadonlyArray<string>,
): Record<string, string> {
  const picked: Record<string, string> = {}
  for (const name of names) {
    const version = source[name]
    if (version) picked[name] = version
  }
  return picked
}

function toSpecs(packages: Record<string, string>): Array<string> {
  return Object.entries(packages).map(([name, version]) => `${name}@${version}`)
}

export function buildUpdateCommand(
  manager: PackageManager,
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
): string {
  const deps = toSpecs(pickPackages(dependencies, RUNTIME_PACKAGES))
  const devDeps = toSpecs(pickPackages(devDependencies, TYPE_PACKAGES))

  const depCmd = (() => {
    switch (manager) {
      case 'pnpm':
        return deps.length ? `pnpm add ${deps.join(' ')}` : ''
      case 'npm':
        return deps.length ? `npm install ${deps.join(' ')}` : ''
      case 'yarn':
        return deps.length ? `yarn add ${deps.join(' ')}` : ''
      case 'bun':
        return deps.length ? `bun add ${deps.join(' ')}` : ''
    }
  })()

  const devCmd = (() => {
    switch (manager) {
      case 'pnpm':
        return devDeps.length ? `pnpm add -D ${devDeps.join(' ')}` : ''
      case 'npm':
        return devDeps.length ? `npm install -D ${devDeps.join(' ')}` : ''
      case 'yarn':
        return devDeps.length ? `yarn add -D ${devDeps.join(' ')}` : ''
      case 'bun':
        return devDeps.length ? `bun add -d ${devDeps.join(' ')}` : ''
    }
  })()

  return [depCmd, devCmd].filter(Boolean).join(' && ')
}
