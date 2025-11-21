import { BaseResource } from './base'
import {
  CreditMemoSchema,
  type CreditMemo,
  type CreateCreditMemoRequest,
  type UpdateCreditMemoRequest,
  type CreditMemoListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class CreditMemoResource extends BaseResource<
  CreditMemo,
  CreateCreditMemoRequest,
  UpdateCreditMemoRequest,
  CreditMemoListParams
> {
  protected readonly endpoint = '/v3/credit-memos'
  protected readonly entitySchema = CreditMemoSchema
  protected readonly listSchema = PaginatedResponseSchema(CreditMemoSchema)
}
