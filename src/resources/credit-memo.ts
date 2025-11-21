import { BaseResource } from './base'
import {
  type CreditMemo,
  type CreateCreditMemoRequest,
  type UpdateCreditMemoRequest,
  type CreditMemoListParams,
} from '../types'

export class CreditMemoResource extends BaseResource<
  CreditMemo,
  CreateCreditMemoRequest,
  UpdateCreditMemoRequest,
  CreditMemoListParams
> {
  protected readonly endpoint = '/v3/credit-memos'
}
