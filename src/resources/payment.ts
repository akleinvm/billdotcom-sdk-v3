import { BaseResource } from './base'
import {
  type Payment,
  type CreatePaymentRequest,
  type UpdatePaymentRequest,
  type PaymentListParams,
} from '../types'

export class PaymentResource extends BaseResource<
  Payment,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentListParams
> {
  protected readonly endpoint = '/v3/payments'
}
