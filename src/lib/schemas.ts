import { z } from 'zod'

export const packageJsonSchema = z.object({
  dependencies: z.object({
    next: z.string(),
  }),
})
