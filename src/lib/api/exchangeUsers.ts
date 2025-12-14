/**
 * ExchangeUser API methods
 *
 * API methods for managing ExchangeUser entities.
 * Provides CRUD operations for exchange users (user accounts on trading platforms).
 */

import { apiClient } from './client';
import type {
  ExchangeUser,
  CreateExchangeUserRequest,
  UpdateExchangeUserRequest,
} from '../types/exchangeUser';

/**
 * API endpoints for exchange users
 */
const ENDPOINTS = {
  base: '/exchange-users',
  byId: (id: string) => `/exchange-users/${id}`,
} as const;

/**
 * Parameters for listing exchange users
 */
export interface GetExchangeUsersParams {
  exchange_id?: string;
  sort_by?: 'name' | 'external_user_id' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

/**
 * Get all exchange users with optional filtering and sorting
 *
 * @param params - Filter and sort parameters
 * @returns Array of exchange users matching criteria
 * @throws {ApiError} On API errors
 *
 * @example
 * ```typescript
 * // Get all users for a specific exchange, sorted by name
 * const users = await getExchangeUsers({
 *   exchange_id: '123e4567-...',
 *   sort_by: 'name',
 *   sort_order: 'asc'
 * });
 * ```
 */
export async function getExchangeUsers(params?: GetExchangeUsersParams): Promise<ExchangeUser[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.exchange_id) {
    searchParams.append('exchange_id', params.exchange_id);
  }
  if (params?.sort_by) {
    searchParams.append('sort_by', params.sort_by);
  }
  if (params?.sort_order) {
    searchParams.append('sort_order', params.sort_order);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `${ENDPOINTS.base}?${queryString}` : ENDPOINTS.base;
  
  return apiClient.get<ExchangeUser[]>(url);
}

/**
 * Get a single exchange user by ID
 *
 * @param id - ExchangeUser UUID
 * @returns ExchangeUser details
 * @throws {NotFoundError} If exchange user doesn't exist
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const user = await getExchangeUser('123e4567-e89b-12d3-a456-426614174000');
 * console.log(user.name); // 'john_doe'
 * ```
 */
export async function getExchangeUser(id: string): Promise<ExchangeUser> {
  return apiClient.get<ExchangeUser>(ENDPOINTS.byId(id));
}

/**
 * Create a new exchange user
 *
 * @param data - ExchangeUser creation data
 * @returns Created exchange user with generated ID and timestamps
 * @throws {ValidationError} If data is invalid
 * @throws {NotFoundError} If referenced exchange doesn't exist
 * @throws {ConflictError} If user with same external_user_id already exists on that exchange
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const newUser = await createExchangeUser({
 *   exchange_id: '123e4567-...',
 *   external_user_id: 'ext_12345',
 *   name: 'john_doe'
 * });
 * console.log(newUser.id); // '456e7890-...'
 * ```
 */
export async function createExchangeUser(data: CreateExchangeUserRequest): Promise<ExchangeUser> {
  return apiClient.post<ExchangeUser>(ENDPOINTS.base, data);
}

/**
 * Update an existing exchange user
 *
 * @param id - ExchangeUser UUID
 * @param data - Partial update data (only changed fields)
 * @returns Updated exchange user
 * @throws {NotFoundError} If exchange user doesn't exist
 * @throws {ValidationError} If data is invalid
 * @throws {ConflictError} If external_user_id conflicts with another user
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const updated = await updateExchangeUser('456e7890-...', {
 *   name: 'john_doe_updated'
 * });
 * console.log(updated.name); // 'john_doe_updated'
 * ```
 */
export async function updateExchangeUser(
  id: string,
  data: UpdateExchangeUserRequest
): Promise<ExchangeUser> {
  return apiClient.patch<ExchangeUser>(ENDPOINTS.byId(id), data);
}

/**
 * Delete an exchange user
 *
 * @param id - ExchangeUser UUID
 * @throws {NotFoundError} If exchange user doesn't exist
 * @throws {ConflictError} If exchange user has related records
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * await deleteExchangeUser('456e7890-...');
 * // Exchange user is deleted
 * ```
 */
export async function deleteExchangeUser(id: string): Promise<void> {
  return apiClient.delete<void>(ENDPOINTS.byId(id));
}
