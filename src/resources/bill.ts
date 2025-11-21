import { BaseResource } from './base'
import {
  type Bill,
  type CreateBillRequest,
  type UpdateBillRequest,
  type BillListParams,
} from '../types'
import { type RequestConfig } from '../utils/request'

export class BillResource extends BaseResource<
  Bill,
  CreateBillRequest,
  UpdateBillRequest,
  BillListParams
> {
  protected readonly endpoint = '/v3/bills'
  protected readonly bulkResponseKey = 'bills'

  constructor(getConfig: () => RequestConfig) {
    super(getConfig)
  }
}
