import { z } from 'zod'
import { ListParamsSchema } from '../common'

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
  id: z.string(),
  archived: z.boolean(),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional(),
  customerId: z.string().optional(),
  totalAmount: z.number().optional(),
  dueAmount: z.number().optional(),
  scheduledAmount: z.number().optional(),
  creditAmount: z.number().optional(),
  status: InvoiceStatusSchema.optional(),
  exchangeRate: z.number().optional(),
  createdTime: z.string(),
  updatedTime: z.string(),
  invoiceLineItems: z.array(InvoiceLineItemSchema).optional(),
  payToChartOfAccountId: z.string().optional(),
  payments: z.array(InvoicePaymentSchema).optional(),
  classifications: InvoiceClassificationsSchema.optional(),
  salesTaxItemId: z.string().optional(),
  salesTaxTotal: z.number().optional(),
  salesTaxPercentage: z.number().optional(),
  enableCardPayment: z.boolean().optional(),
  convenienceFee: InvoiceConvenienceFeeSchema.optional(),
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

// Infer types from schemas
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
