export interface BillClientOptions {
  autoLogin?: boolean
}

export interface LoginCredentials {
  username: string
  password: string
  organizationId: string
  devKey: string
  environment?: 'sandbox' | 'production'
}

/**
 * @deprecated Use BillClientOptions for constructor and LoginCredentials for login()
 */
export interface BillClientConfig {
  username: string
  password: string
  organizationId: string
  devKey: string
  environment?: 'sandbox' | 'production'
  autoLogin?: boolean
}

export interface PaginationParams {
  max?: number             // 1 to 100
  page?: string | null     // nextPage/prevPage token
}

/**
 * Supported filter operators for Bill.com API search operations
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'sw'

/**
 * Filter for 'in' and 'nin' operators that accept arrays
 */
export interface ArrayFilter {
  field: string
  op: 'in' | 'nin'
  value: string[]
}

/**
 * Filter for scalar operators (eq, ne, gt, gte, lt, lte, sw)
 */
export interface ScalarFilter {
  field: string
  op: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'sw'
  value: string | number | boolean
}

/**
 * Union type for all filter types
 */
export type Filter = ArrayFilter | ScalarFilter

export interface ListParams extends PaginationParams {
  filters?: Filter[]
  sort?: Array<{ field: string; order: 'asc' | 'desc' }>
}

export interface PaginatedResponse<T> {
  nextPage?: string
  prevPage?: string
  results: T[]
}

export interface ApiResponse<T> {
  response_status: number
  response_message: string
  response_data: T
}

export interface LoginResponse {
  sessionId: string
  organizationId: string
  userId: string
  apiEndPoint: string
}

export interface SessionInfo {
  sessionId: string
  organizationId: string
  userId: string
  apiEndPoint: string
}

export type EntityStatus = 'active' | 'inactive' | 'archived'
