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

export interface ListParams extends PaginationParams {
  filters?: Array<{ field: string; op: string; value: unknown }>
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
