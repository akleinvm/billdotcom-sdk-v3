import { z } from 'zod'
import { ListParamsSchema } from '../common'

// ============================================================================
// Enum Constants - Use these for autocomplete and validation
// ============================================================================

/** Valid account types for a customer */
export const CUSTOMER_ACCOUNT_TYPES = ['BUSINESS', 'PERSON', 'NONE'] as const

/** Fields that can be used for filtering customers */
export const CUSTOMER_FILTERABLE_FIELDS = [
  'id',
  'archived',
  'name',
  'email',
  'companyName',
  'accountNumber',
  'createdTime',
  'updatedTime',
] as const

/** Fields that can be used for sorting customers */
export const CUSTOMER_SORTABLE_FIELDS = ['name', 'createdTime', 'updatedTime'] as const

// ============================================================================
// Zod Schemas
// ============================================================================

export const CustomerAccountTypeSchema = z.enum(CUSTOMER_ACCOUNT_TYPES)

export const CustomerContactSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const CustomerAddressSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  line1: z.string().optional(),
  zipOrPostalCode: z.string().optional(),
  line2: z.string().optional(),
  stateOrProvince: z.string().optional(),
  countryName: z.string().optional(),
})

export const CustomerBalanceSchema = z.object({
  amount: z.number().optional(),
})

export const CustomerSchema = z.object({
  /** Unique identifier for the customer */
  id: z.string(),
  /** Whether the customer is archived */
  archived: z.boolean(),
  /** Primary email address for the customer */
  email: z.string().optional(),
  /** Customer name (individual or display name) */
  name: z.string().optional(),
  /** Company name for business customers */
  companyName: z.string().optional(),
  /** Contact person details */
  contact: CustomerContactSchema.optional(),
  /** Primary phone number */
  phone: z.string().optional(),
  /** Fax number */
  fax: z.string().optional(),
  /** Description or notes about the customer */
  description: z.string().optional(),
  /** Currency code for invoices (e.g., "USD") */
  invoiceCurrency: z.string().optional(),
  /** Type of account - BUSINESS or PERSON */
  accountType: CustomerAccountTypeSchema.optional(),
  /** ID of the payment term to use */
  paymentTermId: z.string().optional(),
  /** Your internal account number for this customer */
  accountNumber: z.string().optional(),
  /** Billing address */
  billingAddress: CustomerAddressSchema.optional(),
  /** Shipping address */
  shippingAddress: CustomerAddressSchema.optional(),
  /** Current balance owed by this customer */
  balance: CustomerBalanceSchema.optional(),
  /** ISO 8601 timestamp when the customer was created */
  createdTime: z.string(),
  /** ISO 8601 timestamp when the customer was last updated */
  updatedTime: z.string(),
})

export const CreateCustomerRequestSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  companyName: z.string().optional(),
  contact: CustomerContactSchema.optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  description: z.string().optional(),
  invoiceCurrency: z.string().optional(),
  accountType: CustomerAccountTypeSchema.optional(),
  paymentTermId: z.string().optional(),
  accountNumber: z.string().optional(),
  billingAddress: CustomerAddressSchema.optional(),
  shippingAddress: CustomerAddressSchema.optional(),
})

export const UpdateCustomerRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  companyName: z.string().optional(),
  contact: CustomerContactSchema.optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  description: z.string().optional(),
  invoiceCurrency: z.string().optional(),
  accountType: CustomerAccountTypeSchema.optional(),
  paymentTermId: z.string().optional(),
  accountNumber: z.string().optional(),
  billingAddress: CustomerAddressSchema.optional(),
  shippingAddress: CustomerAddressSchema.optional(),
})

export const CustomerListParamsSchema = ListParamsSchema

// ============================================================================
// Type Inference
// ============================================================================

export type CustomerAccountType = z.infer<typeof CustomerAccountTypeSchema>
export type CustomerContact = z.infer<typeof CustomerContactSchema>
export type CustomerAddress = z.infer<typeof CustomerAddressSchema>
export type CustomerBalance = z.infer<typeof CustomerBalanceSchema>
export type Customer = z.infer<typeof CustomerSchema>
export type CreateCustomerRequest = z.infer<typeof CreateCustomerRequestSchema>
export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>
export type CustomerListParams = z.infer<typeof CustomerListParamsSchema>

/** Type-safe filter field names for Customer */
export type CustomerFilterField = (typeof CUSTOMER_FILTERABLE_FIELDS)[number]

/** Type-safe sort field names for Customer */
export type CustomerSortField = (typeof CUSTOMER_SORTABLE_FIELDS)[number]
