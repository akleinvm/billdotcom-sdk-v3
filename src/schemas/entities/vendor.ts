import { z } from 'zod'

export const VendorAccountTypeSchema = z.enum(['BUSINESS', 'PERSON', 'NONE'])

export const VendorAddressSchema = z.object({
  line1: z.string().optional(),
  city: z.string().optional(),
  stateOrProvince: z.string().optional(),
  zipOrPostalCode: z.string().optional(),
  country: z.string().optional(),
})

export const VendorBankAccountTypeSchema = z.enum(['CHECKING', 'SAVINGS'])

export const VendorBankAccountOwnerTypeSchema = z.enum(['BUSINESS', 'PERSON'])

export const VendorBankAccountSchema = z.object({
  nameOnAccount: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  type: VendorBankAccountTypeSchema.optional(),
  ownerType: VendorBankAccountOwnerTypeSchema.optional(),
})

export const VendorVirtualCardStatusSchema = z.enum(['ENROLLED', 'UNENROLLED', 'PENDING', 'UNKNOWN'])

export const VendorVirtualCardSchema = z.object({
  status: VendorVirtualCardStatusSchema.optional(),
})

export const VendorPayByTypeSchema = z.enum(['ACH', 'CHECK', 'VIRTUAL_CARD'])

export const VendorPaymentInformationSchema = z.object({
  payeeName: z.string().optional(),
  payByType: VendorPayByTypeSchema.optional(),
  bankAccount: VendorBankAccountSchema.optional(),
  virtualCard: VendorVirtualCardSchema.optional(),
})

export const VendorAdditionalInfoSchema = z.object({
  track1099: z.boolean().optional(),
  combinePayments: z.boolean().optional(),
})

export const VendorBalanceSchema = z.object({
  amount: z.number().optional(),
})

export const VendorAutoPaySchema = z.object({
  enabled: z.boolean().optional(),
})

export const VendorSchema = z.object({
  id: z.string(),
  archived: z.boolean(),
  name: z.string(),
  shortName: z.string().optional(),
  accountType: VendorAccountTypeSchema,
  email: z.string().optional(),
  phone: z.string().optional(),
  address: VendorAddressSchema.optional(),
  paymentInformation: VendorPaymentInformationSchema.optional(),
  additionalInfo: VendorAdditionalInfoSchema.optional(),
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

export const VendorListParamsSchema = z.object({
  max: z.number().optional(),
  page: z.string().optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        op: z.string(),
        value: z.unknown(),
      })
    )
    .optional(),
  sort: z.array(z.object({ field: z.string(), order: z.enum(['asc', 'desc']) })).optional(),
})

// Infer types from schemas
export type VendorAccountType = z.infer<typeof VendorAccountTypeSchema>
export type VendorAddress = z.infer<typeof VendorAddressSchema>
export type VendorBankAccount = z.infer<typeof VendorBankAccountSchema>
export type VendorVirtualCard = z.infer<typeof VendorVirtualCardSchema>
export type VendorPaymentInformation = z.infer<typeof VendorPaymentInformationSchema>
export type VendorAdditionalInfo = z.infer<typeof VendorAdditionalInfoSchema>
export type VendorBalance = z.infer<typeof VendorBalanceSchema>
export type VendorAutoPay = z.infer<typeof VendorAutoPaySchema>
export type Vendor = z.infer<typeof VendorSchema>
export type CreateVendorRequest = z.infer<typeof CreateVendorRequestSchema>
export type UpdateVendorRequest = z.infer<typeof UpdateVendorRequestSchema>
export type VendorListParams = z.infer<typeof VendorListParamsSchema>
