import { z } from 'zod'

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    nextPage: z.string().optional(),
    prevPage: z.string().optional(),
    results: z.array(itemSchema),
  })

export type PaginatedResponse<T> = {
  nextPage?: string
  prevPage?: string
  results: T[]
}
