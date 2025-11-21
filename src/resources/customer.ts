import { BaseResource } from './base'
import {
  type Customer,
  type CreateCustomerRequest,
  type UpdateCustomerRequest,
  type CustomerListParams,
} from '../types'

export class CustomerResource extends BaseResource<
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListParams
> {
  protected readonly endpoint = '/v3/customers'
}
