import {
  BillApiError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  SessionExpiredError,
} from './errors.js'

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  path: string
  body?: unknown
  headers?: Record<string, string>
}

export interface RequestConfig {
  baseUrl: string
  devKey: string
  sessionId?: string
}

export async function makeRequest<T>(
  config: RequestConfig,
  options: RequestOptions
): Promise<T> {
  const url = `${config.baseUrl}${options.path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    devKey: config.devKey,
    ...options.headers,
  }

  if (config.sessionId) {
    headers['sessionId'] = config.sessionId
  }

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  // Handle empty responses (e.g., logout)
  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  let responseData: unknown
  try {
    responseData = JSON.parse(text)
  } catch {
    if (!response.ok) {
      throw new BillApiError(text || 'API request failed', response.status, 1, text)
    }
    return undefined as T
  }

  // Check if response is an error array (Bill.com error format)
  // Only treat as error if response is not OK and it's an array with error messages
  if (Array.isArray(responseData) && !response.ok) {
    const errorMessage = responseData[0]?.message || 'Unknown API error'

    if (
      errorMessage.toLowerCase().includes('session') &&
      errorMessage.toLowerCase().includes('expired')
    ) {
      throw new SessionExpiredError(errorMessage, responseData)
    }

    if (
      response.status === 401 ||
      errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('authentication')
    ) {
      throw new AuthenticationError(errorMessage, responseData)
    }

    if (
      response.status === 404 ||
      errorMessage.toLowerCase().includes('not found')
    ) {
      throw new NotFoundError(errorMessage, responseData)
    }

    if (
      response.status === 400 ||
      errorMessage.toLowerCase().includes('invalid') ||
      errorMessage.toLowerCase().includes('required')
    ) {
      throw new ValidationError(errorMessage, responseData)
    }

    throw new BillApiError(errorMessage, response.status, 1, responseData)
  }

  // Check HTTP status for errors
  if (!response.ok) {
    const errorData = responseData as Record<string, unknown>
    const message = (errorData.message || errorData.error || 'API request failed') as string
    throw new BillApiError(message, response.status, 1, responseData)
  }

  return responseData as T
}
