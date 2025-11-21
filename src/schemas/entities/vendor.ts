import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid account types for a vendor */
export const VENDOR_ACCOUNT_TYPES = ['BUSINESS', 'PERSON', 'NONE', 'UNDEFINED'] as const

/** Valid bank account types */
export const VENDOR_BANK_ACCOUNT_TYPES = ['CHECKING', 'SAVINGS'] as const

/** Valid bank account owner types */
export const VENDOR_BANK_ACCOUNT_OWNER_TYPES = ['BUSINESS', 'PERSON'] as const

/** Valid virtual card statuses */
export const VENDOR_VIRTUAL_CARD_STATUSES = [
  'ENROLLED',
  'UNENROLLED',
  'PENDING',
  'UNKNOWN',
  'VERBAL_COMMITMENT',
  'REQUIRE_MORE_INFO',
  'UNDEFINED',
] as const

/** Valid payment methods */
export const VENDOR_PAY_BY_TYPES = ['ACH', 'CHECK', 'VIRTUAL_CARD', 'RPPS', 'UNDEFINED'] as const

/** Valid payment sub-types */
export const VENDOR_PAY_BY_SUB_TYPES = ['MULTIPLE', 'LOCAL', 'WIRE', 'UNDEFINED', 'NONE'] as const

/** Valid tax ID types */
export const VENDOR_TAX_ID_TYPES = ['SSN', 'EIN', 'UNDEFINED'] as const

/** Valid alternate payment types */
export const VENDOR_ALTERNATE_PAY_BY_TYPES = ['UNDEFINED', 'CREDIT_CARD', 'AMEX'] as const

/** Fields that can be used for filtering vendors */
export const VENDOR_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'name',
  'shortName',
  'accountNumber',
  'accountType',
  'email',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting vendors */
export const VENDOR_SORTABLE_FIELDS = ['name', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

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
  /** Unique identifier for the vendor */
  id: z.string(),
  /** Whether the vendor is archived */
  archived: z.boolean(),
  /** Full legal name of the vendor */
  name: z.string(),
  /** Short display name for the vendor */
  shortName: z.string().optional(),
  /** Your internal account number for this vendor */
  accountNumber: z.string().optional(),
  /** Type of account - BUSINESS for companies, PERSON for individuals */
  accountType: VendorAccountTypeSchema,
  /** Primary email address for the vendor */
  email: z.string().optional(),
  /** Primary phone number for the vendor */
  phone: z.string().optional(),
  /** Mailing address for the vendor */
  address: VendorAddressSchema.optional(),
  /** Payment details including bank account and payment method */
  paymentInformation: VendorPaymentInformationSchema.optional(),
  /** Additional vendor information like tax ID and payment terms */
  additionalInfo: VendorAdditionalInfoSchema.optional(),
  /** RPPS (Remote Payment and Presentment Service) ID */
  rppsId: z.string().optional(),
  /** Status of the vendor's bank account */
  bankAccountStatus: z.string().optional(),
  /** Whether this vendor has recurring payments enabled */
  recurringPayments: z.boolean().optional(),
  /** Currency code for bills (e.g., "USD") */
  billCurrency: z.string().optional(),
  /** Current balance owed to this vendor */
  balance: VendorBalanceSchema.optional(),
  /** Auto-pay configuration for this vendor */
  autoPay: VendorAutoPaySchema.optional(),
  /** Vendor's network status */
  networkStatus: z.string().optional(),
  /** ISO 8601 timestamp when the vendor was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the vendor was last updated */
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

// ============================================================================
// Type Inference
// ============================================================================

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

/** Type-safe filter field names for Vendor */
export type VendorFilterField = (typeof VENDOR_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for Vendor */
export type VendorSortField = (typeof VENDOR_SORTABLE_FIELDS)[number]
