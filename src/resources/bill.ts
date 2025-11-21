import { BaseResource } from './base'
import {
  type Bill,
  type CreateBillRequest,
  type UpdateBillRequest,
  type BillListParams,
} from '../types'
import { makeRequest, type RequestConfig } from '../utils/request'

export class BillResource extends BaseResource<
  Bill,
  CreateBillRequest,
  UpdateBillRequest,
  BillListParams
> {
  protected readonly endpoint = '/v3/bills'

  constructor(getConfig: () => RequestConfig) {
    super(getConfig)
  }

  async bulkCreate(bills: CreateBillRequest[]): Promise<Bill[]> {
    const config = this.getConfig()
    return makeRequest<Bill[]>(config, {
      method: 'POST',
      path: `${this.endpoint}/bulk`,
      body: bills,
    })
  }
}
