import { type ZodType } from 'zod'
import type { PaginatedResponse, ListParams } from '../types/common'
import { makeRequest, type RequestConfig } from '../utils/request'

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
      const filterString = params.filters
        .map((f) => `${f.field}:${f.op}:${f.value}`)
        .join(',')
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