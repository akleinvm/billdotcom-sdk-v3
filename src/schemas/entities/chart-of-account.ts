import { z } from 'zod'
import { ListParamsSchema } from '../common'

export const AccountTypeSchema = z.enum([
  'UNSPECIFIED',
  'ACCOUNTS_PAYABLE',
  'ACCOUNTS_RECEIVABLE',
  'BANK',
  'COST_OF_GOODS_SOLD',
  'CREDIT_CARD',
  'EQUITY',
  'EXPENSE',
  'FIXED_ASSET',
  'INCOME',
  'LONG_TERM_LIABILITY',
  'OTHER_ASSET',
  'OTHER_CURRENT_ASSET',
  'OTHER_CURRENT_LIABILITY',
  'OTHER_EXPENSE',
  'OTHER_INCOME',
  'NON_POSTING',
])

export const ChartOfAccountSchema = z.object({
  id: z.string(),
  archived: z.boolean(),
  name: z.string(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  account: z.object({
    type: AccountTypeSchema,
    number: z.string().optional(),
  }),
  createdTime: z.string(),
  updatedTime: z.string(),
})

export const CreateChartOfAccountRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  account: z.object({
    type: AccountTypeSchema,
    number: z.string().optional(),
  }),
})

export const UpdateChartOfAccountRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  account: z
    .object({
      type: AccountTypeSchema.optional(),
      number: z.string().optional(),
    })
    .optional(),
})

export const ChartOfAccountListParamsSchema = ListParamsSchema

// Infer types from schemas
export type AccountType = z.infer<typeof AccountTypeSchema>
export type ChartOfAccount = z.infer<typeof ChartOfAccountSchema>
export type CreateChartOfAccountRequest = z.infer<typeof CreateChartOfAccountRequestSchema>
export type UpdateChartOfAccountRequest = z.infer<typeof UpdateChartOfAccountRequestSchema>
export type ChartOfAccountListParams = z.infer<typeof ChartOfAccountListParamsSchema>
