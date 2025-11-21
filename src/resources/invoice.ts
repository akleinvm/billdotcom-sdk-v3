import { BaseResource } from './base'
import {
  type Invoice,
  type CreateInvoiceRequest,
  type UpdateInvoiceRequest,
  type InvoiceListParams,
} from '../types'

export class InvoiceResource extends BaseResource<
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceListParams
> {
  protected readonly endpoint = '/v3/invoices'
}
