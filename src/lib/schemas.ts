import { z } from 'zod'

export const packageJsonSchema = z.object({
  dependencies: z.object({
    next: z.string().min(1, 'Version string cannot be empty'),
  }),
})

// Schema for GitHub issue API response
export const githubIssueSchema = z.object({
  created_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime().nullable().optional(),
  closed_at: z.iso.datetime().nullable().optional(),
})

// Schema for version string (e.g., "15.0.0", "16.1.2")
export const versionStringSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+/, 'Version must be in format X.Y.Z')
  .refine(
    (val) => {
      const major = parseInt(val.split('.')[0], 10)
      return !isNaN(major) && major > 0
    },
    {
      message: 'Invalid major version number',
    },
  )

// Schema for ISO date string validation
export const isoDateStringSchema = z.iso.datetime().refine(
  (val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  },
  {
    message: 'Invalid date format',
  },
)
