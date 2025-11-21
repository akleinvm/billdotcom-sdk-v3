import { z } from 'zod'
import { ListParamsSchema } from '../common'

export const CustomerAccountTypeSchema = z.enum(['BUSINESS', 'PERSON', 'NONE'])

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
  id: z.string(),
  archived: z.boolean(),
  email: z.string().optional(),
  name: z.string().optional(),
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
  balance: CustomerBalanceSchema.optional(),
  createdTime: z.string(),
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

// Infer types from schemas
export type CustomerAccountType = z.infer<typeof CustomerAccountTypeSchema>
export type CustomerContact = z.infer<typeof CustomerContactSchema>
export type CustomerAddress = z.infer<typeof CustomerAddressSchema>
export type CustomerBalance = z.infer<typeof CustomerBalanceSchema>
export type Customer = z.infer<typeof CustomerSchema>
export type CreateCustomerRequest = z.infer<typeof CreateCustomerRequestSchema>
export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>
export type CustomerListParams = z.infer<typeof CustomerListParamsSchema>
