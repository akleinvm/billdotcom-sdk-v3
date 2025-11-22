import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid account types for chart of accounts */
export const ACCOUNT_TYPES = [
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
] as const

/** Fields that can be used for filtering chart of accounts */
export const CHART_OF_ACCOUNT_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'name',
  'parentId',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting chart of accounts */
export const CHART_OF_ACCOUNT_SORTABLE_FIELDS = ['name', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

export const AccountTypeSchema = z.enum(ACCOUNT_TYPES)

export const ChartOfAccountSchema = z.object({
  /** Unique identifier for the chart of account */
  id: z.string(),
  /** Whether the account is archived */
  archived: z.boolean(),
  /** Account name */
  name: z.string(),
  /** Description of the account */
  description: z.string().optional(),
  /** ID of the parent account (for sub-accounts) */
  parentId: z.string().optional(),
  /** Account details */
  account: z.object({
    /** Account type (BANK, EXPENSE, INCOME, etc.) */
    type: AccountTypeSchema,
    /** Account number */
    number: z.string().optional(),
  }),
  /** ISO 8601 timestamp when the account was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the account was last updated */
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

// ============================================================================
// Type Inference
// ============================================================================

export type AccountType = z.infer<typeof AccountTypeSchema>
export type ChartOfAccount = z.infer<typeof ChartOfAccountSchema>
export type CreateChartOfAccountRequest = z.infer<typeof CreateChartOfAccountRequestSchema>
export type UpdateChartOfAccountRequest = z.infer<typeof UpdateChartOfAccountRequestSchema>
export type ChartOfAccountListParams = z.infer<typeof ChartOfAccountListParamsSchema>

/** Type-safe filter field names for ChartOfAccount */
export type ChartOfAccountFilterField = (typeof CHART_OF_ACCOUNT_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for ChartOfAccount */
export type ChartOfAccountSortField = (typeof CHART_OF_ACCOUNT_SORTABLE_FIELDS)[number]
