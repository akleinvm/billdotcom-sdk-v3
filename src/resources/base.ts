import { type ZodType } from 'zod'
import type { PaginatedResponse, ListParams, Filter } from '../types/common'
import { makeRequest, type RequestConfig } from '../utils/request'

/**
 * Check if a value should be quoted in the filter string
 * Quotes are needed for: date-time values, string values with sw operator, in/nin values
 */
function shouldQuoteValue(value: string | number | boolean): boolean {
  if (typeof value !== 'string') return false
  // Check for ISO 8601 date-time format
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/
  return isoDatePattern.test(value)
}

/**
 * Format a filter into the query string format
 */
function formatFilter(filter: Filter): string {
  if (filter.op === 'in' || filter.op === 'nin') {
    // Array operators: format as quoted comma-separated string
    return `${filter.field}:${filter.op}:"${filter.value.join(',')}"`
  }

  // At this point, filter is ScalarFilter
  const scalarFilter = filter as { field: string; op: string; value: string | number | boolean }
  const value = scalarFilter.value

  // Quote string values for sw operator, or date-time values
  if (filter.op === 'sw' && typeof value === 'string') {
    return `${filter.field}:${filter.op}:"${value}"`
  }
  if (shouldQuoteValue(value)) {
    return `${filter.field}:${filter.op}:"${value}"`
  }

  return `${filter.field}:${filter.op}:${value}`
}

export abstract class BaseResource<
  TEntity,
  TCreateRequest,
  TUpdateRequest,
  TListParams extends ListParams = ListParams,
> {
  protected abstract readonly endpoint: string
  protected abstract readonly entitySchema: ZodType<TEntity>
  protected abstract readonly listSchema: ZodType<PaginatedResponse<TEntity>>

  constructor(protected readonly getConfig: () => RequestConfig) {}

  async list(params?: TListParams): Promise<PaginatedResponse<TEntity>> {
    const config = this.getConfig()

    const queryParams = new URLSearchParams()

    if (params?.max !== undefined) {
      if (params.max < 1 || params.max > 100) {
        throw new Error('max must be between 1 and 100')
      }
      queryParams.set('max', String(params.max))
    }
    if (params?.page) {
      queryParams.set('page', params.page)
    }
    if (params?.sort && params.sort.length > 0) {
      const sortString = params.sort
        .map((s) => `${s.field}:${s.order}`)
        .join(',')
      queryParams.set('sort', sortString)
    }
    if (params?.filters && params.filters.length > 0) {
      const filterString = params.filters.map(formatFilter).join(',')
      queryParams.set('filters', filterString)
    }

    const queryString = queryParams.toString()
    const path = queryString ? `${this.endpoint}?${queryString}` : this.endpoint

    return makeRequest<PaginatedResponse<TEntity>>(
      config,
      {
        method: 'GET',
        path,
      },
      this.listSchema
    )
  }

  async get(id: string): Promise<TEntity> {
    const config = this.getConfig()
    return makeRequest<TEntity>(
      config,
      {
        method: 'GET',
        path: `${this.endpoint}/${id}`,
      },
      this.entitySchema
    )
  }

  async create(data: TCreateRequest): Promise<TEntity> {
    const config = this.getConfig()
    return makeRequest<TEntity>(
      config,
      {
        method: 'POST',
        path: this.endpoint,
        body: data,
      },
      this.entitySchema
    )
  }

  async update(id: string, data: TUpdateRequest): Promise<TEntity> {
    const config = this.getConfig()
    return makeRequest<TEntity>(
      config,
      {
        method: 'PATCH',
        path: `${this.endpoint}/${id}`,
        body: data,
      },
      this.entitySchema
    )
  }

  async archive(id: string): Promise<TEntity> {
    const config = this.getConfig()
    return makeRequest<TEntity>(
      config,
      {
        method: 'POST',
        path: `${this.endpoint}/${id}/archive`,
      },
      this.entitySchema
    )
  }

  async restore(id: string): Promise<TEntity> {
    const config = this.getConfig()
    return makeRequest<TEntity>(
      config,
      {
        method: 'POST',
        path: `${this.endpoint}/${id}/restore`,
      },
      this.entitySchema
    )
  }
}