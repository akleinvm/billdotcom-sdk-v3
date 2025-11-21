import { z } from 'zod'

/**
 * Schema for filter operators supported by Bill.com API
 */
export const FilterOperatorSchema = z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'sw'])

/**
 * Schema for array-based filters (in, nin)
 */
export const ArrayFilterSchema = z.object({
  field: z.string(),
  op: z.enum(['in', 'nin']),
  value: z.array(z.string()),
})

/**
 * Schema for scalar-based filters (eq, ne, gt, gte, lt, lte, sw)
 */
export const ScalarFilterSchema = z.object({
  field: z.string(),
  op: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'sw']),
  value: z.union([z.string(), z.number(), z.boolean()]),
})

/**
 * Union schema for all filter types
 */
export const FilterSchema = z.union([ArrayFilterSchema, ScalarFilterSchema])

/**
 * Common list params schema to be used by all entity list params
 */
export const ListParamsSchema = z.object({
  max: z.number().min(1).max(100).optional(),
  page: z.string().optional(),
  filters: z.array(FilterSchema).optional(),
  sort: z.array(z.object({ field: z.string(), order: z.enum(['asc', 'desc']) })).optional(),
})

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
