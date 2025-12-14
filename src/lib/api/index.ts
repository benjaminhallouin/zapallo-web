/**
 * API Client Module
 *
 * Main entry point for the Zapallo API client library.
 * Exports all API methods and error classes for use throughout the application.
 */

// Re-export client
export { ApiClient, apiClient } from './client';
export type { RequestOptions } from './client';

// Re-export errors
export {
  ApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  NetworkError,
  TimeoutError,
  createApiError,
} from './errors';

// Re-export Exchange API
export {
  getExchanges,
  getExchange,
  createExchange,
  updateExchange,
  deleteExchange,
} from './exchanges';

// Re-export ExchangeUser API
export {
  getExchangeUsers,
  getExchangeUser,
  createExchangeUser,
  updateExchangeUser,
  deleteExchangeUser,
} from './exchangeUsers';

// Re-export ExchangeCard API
export {
  getExchangeCards,
  getExchangeCard,
  createExchangeCard,
  updateExchangeCard,
  deleteExchangeCard,
} from './exchangeCards';
