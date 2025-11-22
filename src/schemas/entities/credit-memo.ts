import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid credit memo statuses */
export const CREDIT_MEMO_STATUSES = ['NOT_APPLIED', 'PARTIALLY_APPLIED', 'FULLY_APPLIED'] as const

/** Fields that can be used for filtering credit memos */
export const CREDIT_MEMO_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'customerId',
  'status',
  'creditDate',
  'amount',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting credit memos */
export const CREDIT_MEMO_SORTABLE_FIELDS = ['creditDate', 'amount', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

export const CreditMemoStatusSchema = z.enum(CREDIT_MEMO_STATUSES)

export const CreditMemoClassificationsSchema = z.object({
  accountingClassId: z.string().optional(),
  departmentId: z.string().optional(),
  jobId: z.string().optional(),
  locationId: z.string().optional(),
})

export const CreditMemoLineItemClassificationsSchema = z.object({
  chartOfAccountId: z.string().optional(),
  accountingClassId: z.string().optional(),
  departmentId: z.string().optional(),
  jobId: z.string().optional(),
  locationId: z.string().optional(),
  itemId: z.string().optional(),
})

export const CreditMemoLineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  ratePercent: z.number().optional(),
  taxable: z.boolean().optional(),
  classifications: CreditMemoLineItemClassificationsSchema.optional(),
})

export const CreditMemoSchema = z.object({
  /** Unique identifier for the credit memo */
  id: z.string(),
  /** Whether the credit memo is archived */
  archived: z.boolean(),
  /** ID of the customer this credit memo is for */
  customerId: z.string().optional(),
  /** Your reference number for this credit memo */
  referenceNumber: z.string().optional(),
  /** Date of the credit memo in ISO 8601 format */
  creditDate: z.string().optional(),
  /** Description or notes */
  description: z.string().optional(),
  /** Sales tax item ID */
  salesTaxItemId: z.string().optional(),
  /** Chart of account ID for payment destination */
  payToChartOfAccountId: z.string().optional(),
  /** Bank account ID for payment */
  payToBankAccountId: z.string().optional(),
  /** Total credit memo amount */
  amount: z.number().optional(),
  /** Amount already applied to invoices */
  appliedAmount: z.number().optional(),
  /** Total sales tax amount */
  salesTaxTotal: z.number().optional(),
  /** Sales tax percentage */
  salesTaxPercentage: z.number().optional(),
  /** Current application status */
  status: CreditMemoStatusSchema.optional(),
  /** ISO 8601 timestamp when the credit memo was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the credit memo was last updated */
  updatedTime: z.string(),
  /** Line items on the credit memo */
  creditMemoLineItems: z.array(CreditMemoLineItemSchema).optional(),
  /** Classification IDs for accounting */
  classifications: CreditMemoClassificationsSchema.optional(),
})

export const CreateCreditMemoRequestSchema = z.object({
  customerId: z.string(),
  referenceNumber: z.string().optional(),
  creditDate: z.string(),
  description: z.string().optional(),
  salesTaxItemId: z.string().optional(),
  payToChartOfAccountId: z.string().optional(),
  payToBankAccountId: z.string().optional(),
  salesTaxTotal: z.number().optional(),
  salesTaxPercentage: z.number().optional(),
  creditMemoLineItems: z.array(CreditMemoLineItemSchema.omit({ id: true })),
  classifications: CreditMemoClassificationsSchema.optional(),
})

export const UpdateCreditMemoRequestSchema = z.object({
  customerId: z.string().optional(),
  referenceNumber: z.string().optional(),
  creditDate: z.string().optional(),
  description: z.string().optional(),
  salesTaxItemId: z.string().optional(),
  payToChartOfAccountId: z.string().optional(),
  payToBankAccountId: z.string().optional(),
  salesTaxTotal: z.number().optional(),
  salesTaxPercentage: z.number().optional(),
  creditMemoLineItems: z.array(CreditMemoLineItemSchema.omit({ id: true })).optional(),
  classifications: CreditMemoClassificationsSchema.optional(),
})

export const CreditMemoListParamsSchema = ListParamsSchema

// ============================================================================
// Type Inference
// ============================================================================

export type CreditMemoStatus = z.infer<typeof CreditMemoStatusSchema>
export type CreditMemoClassifications = z.infer<typeof CreditMemoClassificationsSchema>
export type CreditMemoLineItemClassifications = z.infer<typeof CreditMemoLineItemClassificationsSchema>
export type CreditMemoLineItem = z.infer<typeof CreditMemoLineItemSchema>
export type CreditMemo = z.infer<typeof CreditMemoSchema>
export type CreateCreditMemoRequest = z.infer<typeof CreateCreditMemoRequestSchema>
export type UpdateCreditMemoRequest = z.infer<typeof UpdateCreditMemoRequestSchema>
export type CreditMemoListParams = z.infer<typeof CreditMemoListParamsSchema>

/** Type-safe filter field names for CreditMemo */
export type CreditMemoFilterField = (typeof CREDIT_MEMO_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for CreditMemo */
export type CreditMemoSortField = (typeof CREDIT_MEMO_SORTABLE_FIELDS)[number]
