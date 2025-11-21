import { z } from 'zod'
import { ListParamsSchema } from '../common'

export const AccountingClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  archived: z.boolean(),
  createdTime: z.string(),
  updatedTime: z.string(),
})

export const CreateAccountingClassRequestSchema = z.object({
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

export const UpdateAccountingClassRequestSchema = z.object({
  name: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

export const AccountingClassListParamsSchema = ListParamsSchema

// Infer types from schemas
export type AccountingClass = z.infer<typeof AccountingClassSchema>
export type CreateAccountingClassRequest = z.infer<typeof CreateAccountingClassRequestSchema>
export type UpdateAccountingClassRequest = z.infer<typeof UpdateAccountingClassRequestSchema>
export type AccountingClassListParams = z.infer<typeof AccountingClassListParamsSchema>
