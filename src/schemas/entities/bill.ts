import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid payment statuses for a bill */
export const BILL_PAYMENT_STATUSES = ['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED', 'UNDEFINED'] as const

/** Valid approval statuses for a bill */
export const BILL_APPROVAL_STATUSES = ['UNASSIGNED', 'ASSIGNED', 'APPROVING', 'APPROVED', 'DENIED'] as const

/** Valid approver statuses */
export const APPROVER_STATUSES = ['WAITING', 'APPROVED', 'DENIED', 'REROUTED', 'UNDEFINED'] as const

/** Fields that can be used for filtering bills */
export const BILL_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'vendorId',
  'amount',
  'dueDate',
  'paymentStatus',
  'approvalStatus',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting bills */
export const BILL_SORTABLE_FIELDS = ['dueDate', 'amount', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

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
  /** Unique identifier for the bill */
  id: z.string(),
  /** Whether the bill is archived */
  archived: z.boolean(),
  /** ID of the vendor this bill is from */
  vendorId: z.string().optional(),
  /** Name of the vendor (read-only) */
  vendorName: z.string().optional(),
  /** Total funding amount */
  fundingAmount: z.number().optional(),
  /** Total bill amount */
  amount: z.number().optional(),
  /** Amount already paid */
  paidAmount: z.number().optional(),
  /** Amount still due */
  dueAmount: z.number().optional(),
  /** Amount scheduled for payment */
  scheduledAmount: z.number().optional(),
  /** Amount covered by credits */
  creditAmount: z.number(),
  /** Exchange rate for foreign currency bills */
  exchangeRate: z.number().optional(),
  /** Description or memo for the bill */
  description: z.string().optional(),
  /** Due date in ISO 8601 format (e.g., "2024-01-31") */
  dueDate: z.string(),
  /** Invoice information (number and date) */
  invoice: BillInvoiceSchema,
  /** Line items on the bill */
  billLineItems: z.array(BillLineItemSchema),
  /** Chart of account ID for payment source */
  payFromChartOfAccountId: z.string().optional(),
  /** Current payment status */
  paymentStatus: BillPaymentStatusSchema,
  /** Current approval status */
  approvalStatus: BillApprovalStatusSchema,
  /** ISO 8601 timestamp when the bill was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the bill was last updated */
  updatedTime: z.string(),
  /** Classification IDs for accounting */
  classifications: BillClassificationsSchema.optional(),
  /** List of approvers and their statuses */
  approvers: z.array(BillApproverSchema).optional(),
  /** Associated purchase order number */
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

// ============================================================================
// Type Inference
// ============================================================================

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

/** Type-safe filter field names for Bill */
export type BillFilterField = (typeof BILL_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for Bill */
export type BillSortField = (typeof BILL_SORTABLE_FIELDS)[number]
