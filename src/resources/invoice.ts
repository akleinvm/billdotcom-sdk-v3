import { BaseResource } from './base'
import {
  InvoiceSchema,
  type Invoice,
  type CreateInvoiceRequest,
  type UpdateInvoiceRequest,
  type InvoiceListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class InvoiceResource extends BaseResource<
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceListParams
> {
  protected readonly endpoint = '/v3/invoices'
  protected readonly entitySchema = InvoiceSchema
  protected readonly listSchema = PaginatedResponseSchema(InvoiceSchema)
}
