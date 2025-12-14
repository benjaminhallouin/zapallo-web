/**
 * API Error Classes
 *
 * Custom error classes for handling API-related errors with proper
 * error categorization and structured data.
 */

/**
 * Base API error class
 *
 * Represents any error that occurs during API communication.
 * Extends the native Error class with additional context.
 */
export class ApiError extends Error {
  /** HTTP status code (0 for network errors) */
  public readonly statusCode: number;

  /** Original error data/response */
  public readonly data?: unknown;

  /**
   * Create a new API error
   *
   * @param statusCode - HTTP status code (use 0 for network errors)
   * @param message - Human-readable error message
   * @param data - Additional error context or API response data
   */
  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a client error (4xx)
   */
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  get isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Check if error is a network error
   */
  get isNetworkError(): boolean {
    return this.statusCode === 0;
  }
}

/**
 * Validation error - request data was invalid (400)
 */
export class ValidationError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(400, message, data);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error - requested resource doesn't exist (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(404, message, data);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict error - resource already exists or conflicts with another (409)
 */
export class ConflictError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(409, message, data);
    this.name = 'ConflictError';
  }
}

/**
 * Network error - request failed before reaching the server
 */
export class NetworkError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(0, message, data);
    this.name = 'NetworkError';
  }
}

/**
 * Timeout error - request exceeded timeout limit
 */
export class TimeoutError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(0, message, data);
    this.name = 'TimeoutError';
  }
}

/**
 * Factory function to create appropriate error based on status code
 *
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param data - Additional error data
 * @returns Specific error instance based on status code
 */
export function createApiError(statusCode: number, message: string, data?: unknown): ApiError {
  switch (statusCode) {
    case 400:
      return new ValidationError(message, data);
    case 404:
      return new NotFoundError(message, data);
    case 409:
      return new ConflictError(message, data);
    default:
      return new ApiError(statusCode, message, data);
  }
}
