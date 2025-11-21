import { BaseResource } from './base'
import {
  type ChartOfAccount,
  type CreateChartOfAccountRequest,
  type UpdateChartOfAccountRequest,
  type ChartOfAccountListParams,
} from '../types'

export class ChartOfAccountsResource extends BaseResource<
  ChartOfAccount,
  CreateChartOfAccountRequest,
  UpdateChartOfAccountRequest,
  ChartOfAccountListParams
> {
  protected readonly endpoint = '/v3/classifications/chart-of-accounts'
}
