import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Fields that can be used for filtering accounting classes */
export const ACCOUNTING_CLASS_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'name',
  'shortName',
  'parentId',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting accounting classes */
export const ACCOUNTING_CLASS_SORTABLE_FIELDS = ['name', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

export const AccountingClassSchema = z.object({
  /** Unique identifier for the accounting class */
  id: z.string(),
  /** Class name */
  name: z.string(),
  /** Short display name */
  shortName: z.string().optional(),
  /** Description of the class */
  description: z.string().optional(),
  /** ID of the parent class (for sub-classes) */
  parentId: z.string().optional(),
  /** Whether the class is archived */
  archived: z.boolean(),
  /** ISO 8601 timestamp when the class was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the class was last updated */
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

// ============================================================================
// Type Inference
// ============================================================================

export type AccountingClass = z.infer<typeof AccountingClassSchema>
export type CreateAccountingClassRequest = z.infer<typeof CreateAccountingClassRequestSchema>
export type UpdateAccountingClassRequest = z.infer<typeof UpdateAccountingClassRequestSchema>
export type AccountingClassListParams = z.infer<typeof AccountingClassListParamsSchema>

/** Type-safe filter field names for AccountingClass */
export type AccountingClassFilterField = (typeof ACCOUNTING_CLASS_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for AccountingClass */
export type AccountingClassSortField = (typeof ACCOUNTING_CLASS_SORTABLE_FIELDS)[number]
