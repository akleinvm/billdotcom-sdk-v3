import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid statuses for an invoice */
export const INVOICE_STATUSES = [
  'OPEN',
  'PARTIAL_PAYMENT',
  'PAID',
  'SCHEDULED',
  'VOID',
  'UNDEFINED',
] as const

/** Valid payment statuses for invoice payments */
export const INVOICE_PAYMENT_STATUSES = ['PAID', 'SCHEDULED', 'UNDEFINED'] as const

/** Fields that can be used for filtering invoices */
export const INVOICE_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'invoiceNumber',
  'customerId',
  'status',
  'dueDate',
  'invoiceDate',
  'totalAmount',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting invoices */
export const INVOICE_SORTABLE_FIELDS = ['invoiceDate', 'dueDate', 'totalAmount', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

export const InvoiceStatusSchema = z.enum([
  'OPEN',
  'PARTIAL_PAYMENT',
  'PAID',
  'SCHEDULED',
  'VOID',
  'UNDEFINED',
])

export const InvoicePaymentStatusSchema = z.enum(['PAID', 'SCHEDULED', 'UNDEFINED'])

export const InvoiceClassificationsSchema = z.object({
  accountingClassId: z.string().optional(),
  departmentId: z.string().optional(),
  jobId: z.string().optional(),
  locationId: z.string().optional(),
})

export const InvoiceLineItemClassificationsSchema = z.object({
  chartOfAccountId: z.string().optional(),
  accountingClassId: z.string().optional(),
  departmentId: z.string().optional(),
  jobId: z.string().optional(),
  locationId: z.string().optional(),
  itemId: z.string().optional(),
})

export const InvoiceLineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  classifications: InvoiceLineItemClassificationsSchema.optional(),
})

export const InvoicePaymentSchema = z.object({
  id: z.string().optional(),
  amount: z.number().optional(),
  status: InvoicePaymentStatusSchema.optional(),
  date: z.string().optional(),
})

export const InvoiceConvenienceFeeSchema = z.object({
  percentage: z.number().optional(),
})

export const InvoiceSchema = z.object({
  /** Unique identifier for the invoice */
  id: z.string(),
  /** Whether the invoice is archived */
  archived: z.boolean(),
  /** Your invoice number */
  invoiceNumber: z.string().optional(),
  /** Date of the invoice in ISO 8601 format */
  invoiceDate: z.string().optional(),
  /** Payment due date in ISO 8601 format */
  dueDate: z.string().optional(),
  /** ID of the customer this invoice is for */
  customerId: z.string().optional(),
  /** Total amount of the invoice */
  totalAmount: z.number().optional(),
  /** Amount still due */
  dueAmount: z.number().optional(),
  /** Amount scheduled for payment */
  scheduledAmount: z.number().optional(),
  /** Amount covered by credits */
  creditAmount: z.number().optional(),
  /** Current invoice status */
  status: InvoiceStatusSchema.optional(),
  /** Exchange rate for foreign currency invoices */
  exchangeRate: z.number().optional(),
  /** ISO 8601 timestamp when the invoice was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the invoice was last updated */
  updatedTime: z.string(),
  /** Line items on the invoice */
  invoiceLineItems: z.array(InvoiceLineItemSchema).optional(),
  /** Chart of account ID for payment destination */
  payToChartOfAccountId: z.string().optional(),
  /** Payment records for this invoice */
  payments: z.array(InvoicePaymentSchema).optional(),
  /** Classification IDs for accounting */
  classifications: InvoiceClassificationsSchema.optional(),
  /** Sales tax item ID */
  salesTaxItemId: z.string().optional(),
  /** Total sales tax amount */
  salesTaxTotal: z.number().optional(),
  /** Sales tax percentage */
  salesTaxPercentage: z.number().optional(),
  /** Whether card payment is enabled for this invoice */
  enableCardPayment: z.boolean().optional(),
  /** Convenience fee settings */
  convenienceFee: InvoiceConvenienceFeeSchema.optional(),
  /** ID of the invoice PDF document */
  invoicePdfId: z.string().optional(),
})

export const InvoiceCustomerSchema = z.object({
  id: z.string(),
})

export const CreateInvoiceRequestSchema = z.object({
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  customer: InvoiceCustomerSchema,
  invoiceLineItems: z.array(InvoiceLineItemSchema.omit({ id: true })),
  payToChartOfAccountId: z.string().optional(),
  classifications: InvoiceClassificationsSchema.optional(),
  salesTaxItemId: z.string().optional(),
  salesTaxTotal: z.number().optional(),
  salesTaxPercentage: z.number().optional(),
  enableCardPayment: z.boolean().optional(),
  convenienceFee: InvoiceConvenienceFeeSchema.optional(),
})

export const UpdateInvoiceRequestSchema = z.object({
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional(),
  customerId: z.string().optional(),
  invoiceLineItems: z.array(InvoiceLineItemSchema.omit({ id: true })).optional(),
  payToChartOfAccountId: z.string().optional(),
  classifications: InvoiceClassificationsSchema.optional(),
  salesTaxItemId: z.string().optional(),
  salesTaxTotal: z.number().optional(),
  salesTaxPercentage: z.number().optional(),
  enableCardPayment: z.boolean().optional(),
  convenienceFee: InvoiceConvenienceFeeSchema.optional(),
})

export const InvoiceListParamsSchema = ListParamsSchema

// ============================================================================
// Type Inference
// ============================================================================

export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>
export type InvoicePaymentStatus = z.infer<typeof InvoicePaymentStatusSchema>
export type InvoiceClassifications = z.infer<typeof InvoiceClassificationsSchema>
export type InvoiceLineItemClassifications = z.infer<typeof InvoiceLineItemClassificationsSchema>
export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>
export type InvoicePayment = z.infer<typeof InvoicePaymentSchema>
export type InvoiceConvenienceFee = z.infer<typeof InvoiceConvenienceFeeSchema>
export type InvoiceCustomer = z.infer<typeof InvoiceCustomerSchema>
export type Invoice = z.infer<typeof InvoiceSchema>
export type CreateInvoiceRequest = z.infer<typeof CreateInvoiceRequestSchema>
export type UpdateInvoiceRequest = z.infer<typeof UpdateInvoiceRequestSchema>
export type InvoiceListParams = z.infer<typeof InvoiceListParamsSchema>

/** Type-safe filter field names for Invoice */
export type InvoiceFilterField = (typeof INVOICE_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for Invoice */
export type InvoiceSortField = (typeof INVOICE_SORTABLE_FIELDS)[number]
