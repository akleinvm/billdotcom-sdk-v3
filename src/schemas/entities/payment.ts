import { z } from 'zod'
import { ListParamsSchema } from '../common'

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
  id: z.string(),
  amount: z.number().optional(),
  vendorId: z.string().optional(),
  vendorName: z.string().optional(),
  billId: z.string().optional(),
  description: z.string().optional(),
  processDate: z.string().optional(),
  billPayments: z.array(PaymentBillPaymentSchema).optional(),
  fundingAccount: PaymentFundingAccountSchema.optional(),
  processingOptions: PaymentProcessingOptionsSchema.optional(),
  status: PaymentStatusSchema.optional(),
  disbursementType: PaymentDisbursementTypeSchema.optional(),
  disbursementStatus: PaymentDisbursementStatusSchema.optional(),
  disbursementInfo: PaymentDisbursementInfoSchema.optional(),
  voidInfo: z.array(PaymentVoidInfoSchema).optional(),
  paymentPurpose: PaymentPurposeSchema.optional(),
  singleStatus: PaymentSingleStatusSchema.optional(),
  createdTime: z.string().optional(),
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

// Infer types from schemas
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
