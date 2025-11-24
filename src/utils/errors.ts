export class BillApiError extends Error {
  public readonly statusCode: number
  public readonly responseStatus: number
  public readonly responseData: unknown

  constructor(
    message: string,
    statusCode: number,
    responseStatus: number,
    responseData?: unknown
  ) {
    super(message)
    this.name = 'BillApiError'
    this.statusCode = statusCode
    this.responseStatus = responseStatus
    this.responseData = responseData
  }
}

export class AuthenticationError extends BillApiError {
  constructor(message: string, responseData?: unknown) {
    super(message, 401, 1, responseData)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends BillApiError {
  constructor(message: string, responseData?: unknown) {
    super(message, 404, 1, responseData)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends BillApiError {
  constructor(message: string, responseData?: unknown) {
    super(message, 400, 1, responseData)
    this.name = 'ValidationError'
  }
}

export class SessionExpiredError extends BillApiError {
  constructor(message: string = 'Session expired', responseData?: unknown) {
    super(message, 401, 1, responseData)
    this.name = 'SessionExpiredError'
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}
