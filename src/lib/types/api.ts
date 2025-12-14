/**
 * Common API types
 *
 * Shared types for API communication including error responses,
 * pagination, and request/response wrappers.
 */

/**
 * API error response
 *
 * Standard error format returned by the API
 */
export interface ApiError {
  /** Error message */
  detail: string;
  /** HTTP status code */
  status?: number;
  /** Additional error context */
  errors?: Record<string, string[]>;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Page number (0-indexed) */
  skip?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  items: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number */
  skip: number;
  /** Number of items per page */
  limit: number;
}

/**
 * Base timestamp fields present on all models
 */
export interface TimestampFields {
  /** ISO 8601 creation timestamp */
  created_at: string;
  /** ISO 8601 last update timestamp */
  updated_at: string;
}
