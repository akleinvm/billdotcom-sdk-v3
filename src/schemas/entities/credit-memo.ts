import { z } from 'zod'
import { ListParamsSchema } from '../common'

export const CreditMemoStatusSchema = z.enum([
  'NOT_APPLIED',
  'PARTIALLY_APPLIED',
  'FULLY_APPLIED',
])

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
  id: z.string(),
  archived: z.boolean(),
  customerId: z.string().optional(),
  referenceNumber: z.string().optional(),
  creditDate: z.string().optional(),
  description: z.string().optional(),
  salesTaxItemId: z.string().optional(),
  payToChartOfAccountId: z.string().optional(),
  payToBankAccountId: z.string().optional(),
  amount: z.number().optional(),
  appliedAmount: z.number().optional(),
  salesTaxTotal: z.number().optional(),
  salesTaxPercentage: z.number().optional(),
  status: CreditMemoStatusSchema.optional(),
  createdTime: z.string(),
  updatedTime: z.string(),
  creditMemoLineItems: z.array(CreditMemoLineItemSchema).optional(),
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

// Infer types from schemas
export type CreditMemoStatus = z.infer<typeof CreditMemoStatusSchema>
export type CreditMemoClassifications = z.infer<typeof CreditMemoClassificationsSchema>
export type CreditMemoLineItemClassifications = z.infer<typeof CreditMemoLineItemClassificationsSchema>
export type CreditMemoLineItem = z.infer<typeof CreditMemoLineItemSchema>
export type CreditMemo = z.infer<typeof CreditMemoSchema>
export type CreateCreditMemoRequest = z.infer<typeof CreateCreditMemoRequestSchema>
export type UpdateCreditMemoRequest = z.infer<typeof UpdateCreditMemoRequestSchema>
export type CreditMemoListParams = z.infer<typeof CreditMemoListParamsSchema>
