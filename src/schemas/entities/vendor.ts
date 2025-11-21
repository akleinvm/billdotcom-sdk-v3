import { z } from 'zod'
import { ListParamsSchema } from '../common'

export const VendorAccountTypeSchema = z.enum(['BUSINESS', 'PERSON', 'NONE', 'UNDEFINED'])

export const VendorAddressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  stateOrProvince: z.string().optional(),
  zipOrPostalCode: z.string().optional(),
  country: z.string().optional(),
  countryName: z.string().optional(),
})

export const VendorBankAccountTypeSchema = z.enum(['CHECKING', 'SAVINGS'])

export const VendorBankAccountOwnerTypeSchema = z.enum(['BUSINESS', 'PERSON'])

export const VendorBankAccountSchema = z.object({
  nameOnAccount: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  type: VendorBankAccountTypeSchema.optional(),
  ownerType: VendorBankAccountOwnerTypeSchema.optional(),
  paymentCurrency: z.string().optional(),
})

export const VendorVirtualCardStatusSchema = z.enum([
  'ENROLLED',
  'UNENROLLED',
  'PENDING',
  'UNKNOWN',
  'VERBAL_COMMITMENT',
  'REQUIRE_MORE_INFO',
  'UNDEFINED',
])

export const VendorPayByTypeSchema = z.enum(['ACH', 'CHECK', 'VIRTUAL_CARD', 'RPPS', 'UNDEFINED'])

export const VendorPayBySubTypeSchema = z.enum(['MULTIPLE', 'LOCAL', 'WIRE', 'UNDEFINED', 'NONE'])

export const VendorTaxIdTypeSchema = z.enum(['SSN', 'EIN', 'UNDEFINED'])

export const VendorAlternatePayByTypeSchema = z.enum(['UNDEFINED', 'CREDIT_CARD', 'AMEX'])

export const VendorVirtualCardSchema = z.object({
  status: VendorVirtualCardStatusSchema.optional(),
  remitEmail: z.string().optional(),
  enrollDate: z.string().optional(),
  declineDate: z.string().optional(),
  alternatePayByType: VendorAlternatePayByTypeSchema.optional(),
})

export const VendorPaymentPurposeSchema = z.object({
  text: z.string().optional(),
  code: z
    .object({
      name: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
})

export const VendorPaymentInformationSchema = z.object({
  payeeName: z.string().optional(),
  email: z.string().optional(),
  lastPaymentDate: z.string().optional(),
  payByType: VendorPayByTypeSchema.optional(),
  payBySubType: VendorPayBySubTypeSchema.nullable().optional(),
  bankAccount: VendorBankAccountSchema.optional(),
  virtualCard: VendorVirtualCardSchema.optional(),
  paymentPurpose: VendorPaymentPurposeSchema.optional(),
})

export const VendorAdditionalInfoSchema = z.object({
  taxId: z.string().optional(),
  taxIdType: VendorTaxIdTypeSchema.optional(),
  track1099: z.boolean().optional(),
  leadTimeInDays: z.number().optional(),
  combinePayments: z.boolean().optional(),
  paymentTermId: z.string().optional(),
  companyName: z.string().optional(),
})

export const VendorBalanceSchema = z.object({
  amount: z.number().optional(),
  lastUpdatedDate: z.string().optional(),
})

export const VendorAutoPaySchema = z.object({
  enabled: z.boolean().optional(),
  bankAccountId: z.string().optional(),
  createdBy: z.string().optional(),
  maxAmount: z.number().optional(),
  daysBeforeDueDate: z.number().optional(),
})

export const VendorSchema = z.object({
  id: z.string(),
  archived: z.boolean(),
  name: z.string(),
  shortName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountType: VendorAccountTypeSchema,
  email: z.string().optional(),
  phone: z.string().optional(),
  address: VendorAddressSchema.optional(),
  paymentInformation: VendorPaymentInformationSchema.optional(),
  additionalInfo: VendorAdditionalInfoSchema.optional(),
  rppsId: z.string().optional(),
  bankAccountStatus: z.string().optional(),
  recurringPayments: z.boolean().optional(),
  billCurrency: z.string().optional(),
  balance: VendorBalanceSchema.optional(),
  autoPay: VendorAutoPaySchema.optional(),
  networkStatus: z.string().optional(),
  createdTime: z.string(),
  updatedTime: z.string(),
})

export const CreateVendorRequestSchema = z.object({
  name: z.string(),
  accountType: VendorAccountTypeSchema,
  email: z.string().optional(),
  phone: z.string().optional(),
  address: VendorAddressSchema.optional(),
  paymentInformation: z
    .object({
      payeeName: z.string().optional(),
      bankAccount: z
        .object({
          nameOnAccount: z.string().optional(),
          accountNumber: z.string().optional(),
          routingNumber: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  additionalInfo: z
    .object({
      track1099: z.boolean().optional(),
      combinePayments: z.boolean().optional(),
    })
    .optional(),
  billCurrency: z.string().optional(),
})

export const UpdateVendorRequestSchema = z.object({
  name: z.string().optional(),
  accountType: VendorAccountTypeSchema.optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: VendorAddressSchema.optional(),
  paymentInformation: z
    .object({
      payeeName: z.string().optional(),
    })
    .optional(),
  additionalInfo: z
    .object({
      track1099: z.boolean().optional(),
      combinePayments: z.boolean().optional(),
    })
    .optional(),
  billCurrency: z.string().optional(),
  autoPay: z
    .object({
      enabled: z.boolean().optional(),
    })
    .optional(),
})

export const VendorListParamsSchema = ListParamsSchema

// Infer types from schemas
export type VendorAccountType = z.infer<typeof VendorAccountTypeSchema>
export type VendorAddress = z.infer<typeof VendorAddressSchema>
export type VendorBankAccount = z.infer<typeof VendorBankAccountSchema>
export type VendorVirtualCardStatus = z.infer<typeof VendorVirtualCardStatusSchema>
export type VendorVirtualCard = z.infer<typeof VendorVirtualCardSchema>
export type VendorPayByType = z.infer<typeof VendorPayByTypeSchema>
export type VendorPayBySubType = z.infer<typeof VendorPayBySubTypeSchema>
export type VendorTaxIdType = z.infer<typeof VendorTaxIdTypeSchema>
export type VendorAlternatePayByType = z.infer<typeof VendorAlternatePayByTypeSchema>
export type VendorPaymentPurpose = z.infer<typeof VendorPaymentPurposeSchema>
export type VendorPaymentInformation = z.infer<typeof VendorPaymentInformationSchema>
export type VendorAdditionalInfo = z.infer<typeof VendorAdditionalInfoSchema>
export type VendorBalance = z.infer<typeof VendorBalanceSchema>
export type VendorAutoPay = z.infer<typeof VendorAutoPaySchema>
export type Vendor = z.infer<typeof VendorSchema>
export type CreateVendorRequest = z.infer<typeof CreateVendorRequestSchema>
export type UpdateVendorRequest = z.infer<typeof UpdateVendorRequestSchema>
export type VendorListParams = z.infer<typeof VendorListParamsSchema>
