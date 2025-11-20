import { BaseResource } from './base'
import {
  ChartOfAccountSchema,
  type ChartOfAccount,
  type CreateChartOfAccountRequest,
  type UpdateChartOfAccountRequest,
  type ChartOfAccountListParams,
} from '../types'
import { PaginatedResponseSchema } from '../schemas/common'

export class ChartOfAccountsResource extends BaseResource<
  ChartOfAccount,
  CreateChartOfAccountRequest,
  UpdateChartOfAccountRequest,
  ChartOfAccountListParams
> {
  protected readonly endpoint = '/v3/classifications/chart-of-accounts'
  protected readonly entitySchema = ChartOfAccountSchema
  protected readonly listSchema = PaginatedResponseSchema(ChartOfAccountSchema)
}
