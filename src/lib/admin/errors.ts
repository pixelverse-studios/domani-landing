/**
 * Custom error classes for admin authentication and authorization
 */

/**
 * Base class for admin-related errors
 */
export class AdminError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'AdminError'
    this.statusCode = statusCode
    this.code = code || 'ADMIN_ERROR'
    this.details = details

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details
    }
  }
}

/**
 * Authentication error - invalid credentials or session
 */
export class AdminAuthError extends AdminError {
  constructor(message: string, statusCode: number = 401, details?: any) {
    super(message, statusCode, 'AUTH_ERROR', details)
    this.name = 'AdminAuthError'
  }
}

/**
 * Authorization error - insufficient permissions
 */
export class PermissionDeniedError extends AdminError {
  public readonly requiredRole?: string
  public readonly requiredPermission?: string
  public readonly userRole?: string

  constructor(
    message: string = 'Permission denied',
    details?: {
      requiredRole?: string
      requiredPermission?: string
      userRole?: string
      resource?: string
      action?: string
    }
  ) {
    super(message, 403, 'PERMISSION_DENIED', details)
    this.name = 'PermissionDeniedError'
    this.requiredRole = details?.requiredRole
    this.requiredPermission = details?.requiredPermission
    this.userRole = details?.userRole
  }
}

/**
 * Session expired error
 */
export class SessionExpiredError extends AdminError {
  constructor(message: string = 'Session expired. Please login again.') {
    super(message, 401, 'SESSION_EXPIRED')
    this.name = 'SessionExpiredError'
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends AdminError {
  public readonly retryAfter?: number

  constructor(
    message: string = 'Too many requests. Please try again later.',
    retryAfter?: number
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter })
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

/**
 * Validation error for invalid input
 */
export class ValidationError extends AdminError {
  public readonly fields?: Record<string, string>

  constructor(
    message: string = 'Validation failed',
    fields?: Record<string, string>
  ) {
    super(message, 400, 'VALIDATION_ERROR', { fields })
    this.name = 'ValidationError'
    this.fields = fields
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends AdminError {
  constructor(
    resource: string,
    id?: string
  ) {
    const message = id
      ? `${resource} with id "${id}" not found`
      : `${resource} not found`

    super(message, 404, 'NOT_FOUND', { resource, id })
    this.name = 'NotFoundError'
  }
}

/**
 * Database operation error
 */
export class DatabaseError extends AdminError {
  constructor(
    message: string = 'Database operation failed',
    details?: any
  ) {
    super(message, 500, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

/**
 * Account locked error
 */
export class AccountLockedError extends AdminError {
  public readonly lockedUntil?: Date

  constructor(
    message: string = 'Account is temporarily locked',
    lockedUntil?: Date
  ) {
    super(message, 423, 'ACCOUNT_LOCKED', { lockedUntil })
    this.name = 'AccountLockedError'
    this.lockedUntil = lockedUntil
  }
}

/**
 * Invalid token error
 */
export class InvalidTokenError extends AdminError {
  constructor(
    message: string = 'Invalid or expired token',
    tokenType?: string
  ) {
    super(message, 401, 'INVALID_TOKEN', { tokenType })
    this.name = 'InvalidTokenError'
  }
}

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  TOKEN_EXPIRED: 'Your authentication token has expired.',
  INVALID_TOKEN: 'Invalid authentication token.',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked due to multiple failed login attempts.',
  ACCOUNT_DISABLED: 'Your account has been disabled. Please contact support.',

  // Authorization errors
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  INSUFFICIENT_ROLE: 'Your role does not have access to this resource.',
  UNAUTHORIZED_ACCESS: 'Unauthorized access attempt detected.',

  // Validation errors
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters long.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_FORMAT: 'Invalid format. Please check your input.',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  LOGIN_ATTEMPTS_EXCEEDED: 'Too many failed login attempts. Please try again later.',

  // Resource errors
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  USER_NOT_FOUND: 'User not found.',

  // System errors
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  DATABASE_ERROR: 'Database operation failed. Please try again.',

  // Success messages
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  PASSWORD_RESET_SENT: 'Password reset instructions have been sent to your email.',
  PASSWORD_CHANGED: 'Password successfully changed.',
  PROFILE_UPDATED: 'Profile successfully updated.',
  ACTION_COMPLETED: 'Action completed successfully.'
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error | AdminError): string {
  // If it's our custom error with a specific message, use it
  if (error instanceof AdminError && error.message !== error.code) {
    return error.message
  }

  // Map error codes to user-friendly messages
  if (error instanceof AdminError) {
    switch (error.code) {
      case 'AUTH_ERROR':
        return ERROR_MESSAGES.INVALID_CREDENTIALS
      case 'PERMISSION_DENIED':
        return ERROR_MESSAGES.PERMISSION_DENIED
      case 'SESSION_EXPIRED':
        return ERROR_MESSAGES.SESSION_EXPIRED
      case 'RATE_LIMIT_EXCEEDED':
        return ERROR_MESSAGES.RATE_LIMIT_EXCEEDED
      case 'VALIDATION_ERROR':
        return ERROR_MESSAGES.INVALID_FORMAT
      case 'NOT_FOUND':
        return ERROR_MESSAGES.RESOURCE_NOT_FOUND
      case 'DATABASE_ERROR':
        return ERROR_MESSAGES.DATABASE_ERROR
      case 'ACCOUNT_LOCKED':
        return ERROR_MESSAGES.ACCOUNT_LOCKED
      case 'INVALID_TOKEN':
        return ERROR_MESSAGES.INVALID_TOKEN
      default:
        return ERROR_MESSAGES.SERVER_ERROR
    }
  }

  // Generic error message for unknown errors
  return ERROR_MESSAGES.SERVER_ERROR
}

/**
 * Format error response for API
 */
export function formatErrorResponse(error: Error | AdminError) {
  const isProduction = process.env.NODE_ENV === 'production'

  if (error instanceof AdminError) {
    return {
      error: getUserFriendlyMessage(error),
      code: error.code,
      statusCode: error.statusCode,
      // Only include details in development
      ...(isProduction ? {} : { details: error.details })
    }
  }

  // For generic errors, be more cautious about what we expose
  return {
    error: ERROR_MESSAGES.SERVER_ERROR,
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    // Only include stack trace in development
    ...(isProduction ? {} : { stack: error.stack })
  }
}

/**
 * Log error with appropriate severity
 */
export function logError(error: Error | AdminError, context?: any) {
  const severity = error instanceof AdminError
    ? getSeverityFromStatusCode(error.statusCode)
    : 'error'

  const logData = {
    timestamp: new Date().toISOString(),
    severity,
    error: {
      name: error.name,
      message: error.message,
      ...(error instanceof AdminError ? {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      } : {}),
      stack: error.stack
    },
    context
  }

  switch (severity) {
    case 'warning':
      console.warn('Admin Error:', logData)
      break
    case 'error':
      console.error('Admin Error:', logData)
      break
    default:
      console.log('Admin Error:', logData)
  }
}

/**
 * Get log severity from HTTP status code
 */
function getSeverityFromStatusCode(statusCode: number): 'info' | 'warning' | 'error' {
  if (statusCode >= 500) return 'error'
  if (statusCode >= 400) return 'warning'
  return 'info'
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: Error | AdminError) {
  logError(error)
  const response = formatErrorResponse(error)

  return new Response(
    JSON.stringify(response),
    {
      status: error instanceof AdminError ? error.statusCode : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}