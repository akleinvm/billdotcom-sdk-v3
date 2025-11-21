import { z } from 'zod'
import { ListParamsSchema } from '../common'

export const BillPaymentStatusSchema = z.enum(['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED', 'UNDEFINED'])

export const BillApprovalStatusSchema = z.enum(['UNASSIGNED', 'ASSIGNED', 'APPROVING', 'APPROVED', 'DENIED'])

export const ApproverStatusSchema = z.enum(['WAITING', 'APPROVED', 'DENIED', 'REROUTED', 'UNDEFINED'])

export const BillApproverSchema = z.object({
  userId: z.string(),
  status: ApproverStatusSchema,
  approverOrder: z.number(),
  statusChangedTime: z.string(),
})

export const BillClassificationsSchema = z.object({
  chartOfAccountId: z.string().optional(),
  accountingClassId: z.string().optional(),
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  itemId: z.string().optional(),
})

export const BillLineItemClassificationsSchema = BillClassificationsSchema.extend({
  employeeId: z.string().optional(),
  jobId: z.string().optional(),
  customerId: z.string().optional(),
})

export const BillInvoiceSchema = z.object({
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
})

export const BillVendorCreditSchema = z.object({
  id: z.string(),
  amount: z.number(),
})

export const BillLineItemSchema = z.object({
  id: z.string().optional(),
  amount: z.number().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  classifications: BillLineItemClassificationsSchema.optional(),
})

export const BillSchema = z.object({
  id: z.string(),
  archived: z.boolean(),
  vendorId: z.string().optional(),
  vendorName: z.string().optional(),
  fundingAmount: z.number().optional(),
  amount: z.number().optional(),
  paidAmount: z.number().optional(),
  dueAmount: z.number().optional(),
  scheduledAmount: z.number().optional(),
  creditAmount: z.number(),
  exchangeRate: z.number().optional(),
  description: z.string().optional(),
  dueDate: z.string(),
  invoice: BillInvoiceSchema,
  billLineItems: z.array(BillLineItemSchema),
  payFromChartOfAccountId: z.string().optional(),
  paymentStatus: BillPaymentStatusSchema,
  approvalStatus: BillApprovalStatusSchema,
  createdTime: z.string(),
  updatedTime: z.string(),
  classifications: BillClassificationsSchema.optional(),
  approvers: z.array(BillApproverSchema).optional(),
  purchaseOrderNumber: z.string().optional(),
})

export const CreateBillRequestSchema = z.object({
  vendorId: z.string(),
  description: z.string().optional(),
  dueDate: z.string(),
  billLineItems: z.array(BillLineItemSchema.omit({ id: true })),
  invoice: BillInvoiceSchema,
  payFromChartOfAccountId: z.string().optional(),
  classifications: BillClassificationsSchema.optional(),
  vendorCredits: z.array(BillVendorCreditSchema).optional(),
  purchaseOrderNumber: z.string().optional(),
  billApprovals: z.boolean().optional(),
})

export const UpdateBillRequestSchema = z.object({
  vendorId: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  billLineItems: z.array(BillLineItemSchema.omit({ id: true })).optional(),
  invoice: BillInvoiceSchema.optional(),
  payFromChartOfAccountId: z.string().optional(),
  classifications: BillClassificationsSchema.optional(),
  vendorCredits: z.array(BillVendorCreditSchema).optional(),
  purchaseOrderNumber: z.string().optional(),
  billApprovals: z.boolean().optional(),
})

export const BillListParamsSchema = ListParamsSchema

// Infer types from schemas
export type BillPaymentStatus = z.infer<typeof BillPaymentStatusSchema>
export type BillApprovalStatus = z.infer<typeof BillApprovalStatusSchema>
export type ApproverStatus = z.infer<typeof ApproverStatusSchema>
export type BillApprover = z.infer<typeof BillApproverSchema>
export type BillClassifications = z.infer<typeof BillClassificationsSchema>
export type BillLineItemClassifications = z.infer<typeof BillLineItemClassificationsSchema>
export type BillInvoice = z.infer<typeof BillInvoiceSchema>
export type BillVendorCredit = z.infer<typeof BillVendorCreditSchema>
export type BillLineItem = z.infer<typeof BillLineItemSchema>
export type Bill = z.infer<typeof BillSchema>
export type CreateBillRequest = z.infer<typeof CreateBillRequestSchema>
export type UpdateBillRequest = z.infer<typeof UpdateBillRequestSchema>
export type BillListParams = z.infer<typeof BillListParamsSchema>
