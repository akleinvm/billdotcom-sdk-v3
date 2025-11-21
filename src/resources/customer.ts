import { BaseResource } from './base'
import {
  CustomerSchema,
  type Customer,
  type CreateCustomerRequest,
  type UpdateCustomerRequest,
  type CustomerListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class CustomerResource extends BaseResource<
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListParams
> {
  protected readonly endpoint = '/v3/customers'
  protected readonly entitySchema = CustomerSchema
  protected readonly listSchema = PaginatedResponseSchema(CustomerSchema)
}
