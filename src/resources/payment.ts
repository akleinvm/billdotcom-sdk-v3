import { BaseResource } from './base'
import {
  PaymentSchema,
  type Payment,
  type CreatePaymentRequest,
  type UpdatePaymentRequest,
  type PaymentListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class PaymentResource extends BaseResource<
  Payment,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentListParams
> {
  protected readonly endpoint = '/v3/payments'
  protected readonly entitySchema = PaymentSchema
  protected readonly listSchema = PaginatedResponseSchema(PaymentSchema)
}
