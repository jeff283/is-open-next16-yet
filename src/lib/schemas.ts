import { z } from 'zod'
import { major, valid } from 'semver'

export const packageJsonSchema = z.object({
  dependencies: z
    .record(z.string(), z.string())
    .refine((deps) => typeof deps.next === 'string' && deps.next.length > 0, {
      message: 'dependencies.next is required',
    }),
  devDependencies: z.record(z.string(), z.string()).optional().default({}),
})

// Schema for version string (e.g., "15.0.0", "16.1.2")
export const versionStringSchema = z
  .string()
  .refine((val) => valid(val) !== null, {
    message: 'Version must be a valid semver string (e.g. 15.0.0)',
  })
  .refine(
    (val) => {
      const maj = major(val)
      return maj > 0
    },
    {
      message: 'Invalid major version number',
    },
  )

export const npmPackageLatestSchema = z.object({
  name: z.string(),
  version: z.string(),
})
