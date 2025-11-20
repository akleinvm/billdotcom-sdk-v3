import { z } from 'zod'
import { BaseResource } from './base'
import {
  BillSchema,
  type Bill,
  type CreateBillRequest,
  type UpdateBillRequest,
  type BillListParams,
} from '../types'
import { makeRequest, type RequestConfig } from '../utils/request'
import { PaginatedResponseSchema } from '../schemas/common'

export class BillResource extends BaseResource<
  Bill,
  CreateBillRequest,
  UpdateBillRequest,
  BillListParams
> {
  protected readonly endpoint = '/v3/bills'
  protected readonly entitySchema = BillSchema
  protected readonly listSchema = PaginatedResponseSchema(BillSchema)

  constructor(getConfig: () => RequestConfig) {
    super(getConfig)
  }

  async bulkCreate(bills: CreateBillRequest[]): Promise<Bill[]> {
    const config = this.getConfig()
    return makeRequest<Bill[]>(
      config,
      {
        method: 'POST',
        path: `${this.endpoint}/bulk`,
        body: bills,
      },
      z.array(BillSchema)
    )
  }
}
