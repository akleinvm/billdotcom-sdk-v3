import { BaseResource } from './base'
import {
  type AccountingClass,
  type CreateAccountingClassRequest,
  type UpdateAccountingClassRequest,
  type AccountingClassListParams,
} from '../types'

export class AccountingClassResource extends BaseResource<
  AccountingClass,
  CreateAccountingClassRequest,
  UpdateAccountingClassRequest,
  AccountingClassListParams
> {
  protected readonly endpoint = '/v3/classifications/accounting-classes'
  protected readonly bulkResponseKey = 'accountingClasses'
}
