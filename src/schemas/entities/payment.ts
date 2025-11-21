import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid payment statuses */
export const PAYMENT_STATUSES = [
  'APPROVING',
  'PAID',
  'VOID',
  'SCHEDULED',
  'FAILED',
  'PENDING',
  'UNDEFINED',
] as const

/** Valid disbursement types */
export const PAYMENT_DISBURSEMENT_TYPES = [
  'ACH',
  'CHECK',
  'RPPS',
  'INTERNATIONAL',
  'VCARD',
  'WALLET',
  'OFFLINE',
  'UNDEFINED',
] as const

/** Valid disbursement statuses */
export const PAYMENT_DISBURSEMENT_STATUSES = ['DONE', 'FAILED', 'IN_PROGRESS', 'UNDEFINED'] as const

/** Valid funding account types */
export const PAYMENT_FUNDING_ACCOUNT_TYPES = [
  'BANK_ACCOUNT',
  'CARD_ACCOUNT',
  'AP_CARD',
  'UNDEFINED',
] as const

/** Valid single payment statuses */
export const PAYMENT_SINGLE_STATUSES = [
  'CLEARED',
  'VOID_PENDING',
  'SCHEDULED',
  'PAID',
  'FAILED',
  'UNDEFINED',
] as const

/** Fields that can be used for filtering payments */
export const PAYMENT_FILTERABLE_FIELDS = [
  'id',
  'vendorId',
  'status',
  'disbursementType',
  'processDate',
  'amount',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting payments */
export const PAYMENT_SORTABLE_FIELDS = ['processDate', 'amount', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

export const PaymentStatusSchema = z.enum([
  'APPROVING',
  'PAID',
  'VOID',
  'SCHEDULED',
  'FAILED',
  'PENDING',
  'UNDEFINED',
])

export const PaymentDisbursementTypeSchema = z.enum([
  'ACH',
  'CHECK',
  'RPPS',
  'INTERNATIONAL',
  'VCARD',
  'WALLET',
  'OFFLINE',
  'UNDEFINED',
])

export const PaymentDisbursementStatusSchema = z.enum([
  'DONE',
  'FAILED',
  'IN_PROGRESS',
  'UNDEFINED',
])

export const PaymentFundingAccountTypeSchema = z.enum([
  'BANK_ACCOUNT',
  'CARD_ACCOUNT',
  'AP_CARD',
  'UNDEFINED',
])

export const PaymentSingleStatusSchema = z.enum([
  'CLEARED',
  'VOID_PENDING',
  'SCHEDULED',
  'PAID',
  'FAILED',
  'UNDEFINED',
])

export const PaymentFundingAccountSchema = z.object({
  type: PaymentFundingAccountTypeSchema.optional(),
  id: z.string().optional(),
})

export const PaymentVendorCreditSchema = z.object({
  id: z.string().optional(),
  amount: z.number().optional(),
})

export const PaymentBillPaymentSchema = z.object({
  billId: z.string().optional(),
  amount: z.number().optional(),
  vendorCredits: z.array(PaymentVendorCreditSchema).optional(),
})

export const PaymentProcessingOptionsSchema = z.object({
  requestPayFaster: z.boolean().optional(),
  createBill: z.boolean().optional(),
  requestCheckDeliveryType: z.string().optional(),
})

export const PaymentCheckDisbursementSchema = z.object({
  checkNumber: z.string().optional(),
  mailedDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
})

export const PaymentAchDisbursementSchema = z.object({
  traceNumber: z.string().optional(),
  clearedDate: z.string().optional(),
})

export const PaymentRppsDisbursementSchema = z.object({
  confirmationNumber: z.string().optional(),
})

export const PaymentInternationalDisbursementSchema = z.object({
  referenceNumber: z.string().optional(),
  clearedDate: z.string().optional(),
})

export const PaymentVcardDisbursementSchema = z.object({
  cardNumber: z.string().optional(),
  expirationDate: z.string().optional(),
})

export const PaymentWalletDisbursementSchema = z.object({
  transactionId: z.string().optional(),
})

export const PaymentDisbursementInfoSchema = z.object({
  checkDisbursement: PaymentCheckDisbursementSchema.optional(),
  achDisbursement: PaymentAchDisbursementSchema.optional(),
  rppsDisbursement: PaymentRppsDisbursementSchema.optional(),
  internationalDisbursement: PaymentInternationalDisbursementSchema.optional(),
  vcardDisbursement: PaymentVcardDisbursementSchema.optional(),
  walletDisbursement: PaymentWalletDisbursementSchema.optional(),
})

export const PaymentVoidInfoSchema = z.object({
  voidDate: z.string().optional(),
  voidReason: z.string().optional(),
  voidedBy: z.string().optional(),
})

export const PaymentPurposeSchema = z.object({
  text: z.string().optional(),
  code: z
    .object({
      name: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
})

export const PaymentSchema = z.object({
  /** Unique identifier for the payment */
  id: z.string(),
  /** Total payment amount */
  amount: z.number().optional(),
  /** ID of the vendor being paid */
  vendorId: z.string().optional(),
  /** Name of the vendor (read-only) */
  vendorName: z.string().optional(),
  /** ID of the bill being paid (for single-bill payments) */
  billId: z.string().optional(),
  /** Description or memo for the payment */
  description: z.string().optional(),
  /** Date to process the payment in ISO 8601 format */
  processDate: z.string().optional(),
  /** List of bills included in this payment */
  billPayments: z.array(PaymentBillPaymentSchema).optional(),
  /** Source account for the payment */
  fundingAccount: PaymentFundingAccountSchema.optional(),
  /** Payment processing options */
  processingOptions: PaymentProcessingOptionsSchema.optional(),
  /** Current payment status */
  status: PaymentStatusSchema.optional(),
  /** Type of disbursement (ACH, CHECK, etc.) */
  disbursementType: PaymentDisbursementTypeSchema.optional(),
  /** Status of the disbursement */
  disbursementStatus: PaymentDisbursementStatusSchema.optional(),
  /** Detailed disbursement information */
  disbursementInfo: PaymentDisbursementInfoSchema.optional(),
  /** Information about voided payments */
  voidInfo: z.array(PaymentVoidInfoSchema).optional(),
  /** Purpose of the payment */
  paymentPurpose: PaymentPurposeSchema.optional(),
  /** Single payment status */
  singleStatus: PaymentSingleStatusSchema.optional(),
  /** ISO 8601 timestamp when the payment was created */
  createdTime: z.string().optional(),
  /** ISO 8601 timestamp when the payment was last updated */
  updatedTime: z.string().optional(),
})

export const CreatePaymentRequestSchema = z.object({
  vendorId: z.string(),
  amount: z.number().optional(),
  processDate: z.string().optional(),
  description: z.string().optional(),
  billPayments: z.array(PaymentBillPaymentSchema).optional(),
  fundingAccount: PaymentFundingAccountSchema.optional(),
  processingOptions: PaymentProcessingOptionsSchema.optional(),
  paymentPurpose: PaymentPurposeSchema.optional(),
})

export const UpdatePaymentRequestSchema = z.object({
  amount: z.number().optional(),
  processDate: z.string().optional(),
  description: z.string().optional(),
  billPayments: z.array(PaymentBillPaymentSchema).optional(),
  fundingAccount: PaymentFundingAccountSchema.optional(),
  processingOptions: PaymentProcessingOptionsSchema.optional(),
  paymentPurpose: PaymentPurposeSchema.optional(),
})

export const PaymentListParamsSchema = ListParamsSchema

// ============================================================================
// Type Inference
// ============================================================================

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>
export type PaymentDisbursementType = z.infer<typeof PaymentDisbursementTypeSchema>
export type PaymentDisbursementStatus = z.infer<typeof PaymentDisbursementStatusSchema>
export type PaymentFundingAccountType = z.infer<typeof PaymentFundingAccountTypeSchema>
export type PaymentSingleStatus = z.infer<typeof PaymentSingleStatusSchema>
export type PaymentFundingAccount = z.infer<typeof PaymentFundingAccountSchema>
export type PaymentVendorCredit = z.infer<typeof PaymentVendorCreditSchema>
export type PaymentBillPayment = z.infer<typeof PaymentBillPaymentSchema>
export type PaymentProcessingOptions = z.infer<typeof PaymentProcessingOptionsSchema>
export type PaymentCheckDisbursement = z.infer<typeof PaymentCheckDisbursementSchema>
export type PaymentAchDisbursement = z.infer<typeof PaymentAchDisbursementSchema>
export type PaymentRppsDisbursement = z.infer<typeof PaymentRppsDisbursementSchema>
export type PaymentInternationalDisbursement = z.infer<typeof PaymentInternationalDisbursementSchema>
export type PaymentVcardDisbursement = z.infer<typeof PaymentVcardDisbursementSchema>
export type PaymentWalletDisbursement = z.infer<typeof PaymentWalletDisbursementSchema>
export type PaymentDisbursementInfo = z.infer<typeof PaymentDisbursementInfoSchema>
export type PaymentVoidInfo = z.infer<typeof PaymentVoidInfoSchema>
export type PaymentPurpose = z.infer<typeof PaymentPurposeSchema>
export type Payment = z.infer<typeof PaymentSchema>
export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>
export type UpdatePaymentRequest = z.infer<typeof UpdatePaymentRequestSchema>
export type PaymentListParams = z.infer<typeof PaymentListParamsSchema>

/** Type-safe filter field names for Payment */
export type PaymentFilterField = (typeof PAYMENT_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for Payment */
export type PaymentSortField = (typeof PAYMENT_SORTABLE_FIELDS)[number]
