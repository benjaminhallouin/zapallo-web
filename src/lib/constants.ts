/**
 * Application constants
 * 
 * Global constants used throughout the application
 */

/**
 * API version prefix
 */
export const API_VERSION = 'v1';

/**
 * API endpoints base paths
 */
export const API_ENDPOINTS = {
  EXCHANGES: '/api/v1/exchanges',
  EXCHANGE_USERS: '/api/v1/exchange_users',
  EXCHANGE_CARDS: '/api/v1/exchange_cards',
} as const;

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  EXCHANGES: '/exchanges',
  EXCHANGE_USERS: '/exchange-users',
  EXCHANGE_CARDS: '/exchange-cards',
} as const;

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * HTTP status codes for common responses
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
