import { BaseResource } from './base'
import {
  AccountingClassSchema,
  type AccountingClass,
  type CreateAccountingClassRequest,
  type UpdateAccountingClassRequest,
  type AccountingClassListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class AccountingClassResource extends BaseResource<
  AccountingClass,
  CreateAccountingClassRequest,
  UpdateAccountingClassRequest,
  AccountingClassListParams
> {
  protected readonly endpoint = '/v3/classifications/accounting-classes'
  protected readonly entitySchema = AccountingClassSchema
  protected readonly listSchema = PaginatedResponseSchema(AccountingClassSchema)
}
