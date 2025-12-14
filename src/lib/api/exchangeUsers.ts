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
  base: '/exchange_users',
  byId: (id: string) => `/exchange_users/${id}`,
} as const;

/**
 * Get all exchange users
 *
 * @returns Array of all exchange users
 * @throws {ApiError} On API errors
 *
 * @example
 * ```typescript
 * const users = await getExchangeUsers();
 * console.log(users); // [{ id: '...', name: 'john_doe', ... }]
 * ```
 */
export async function getExchangeUsers(): Promise<ExchangeUser[]> {
  return apiClient.get<ExchangeUser[]>(ENDPOINTS.base);
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
  return apiClient.put<ExchangeUser>(ENDPOINTS.byId(id), data);
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
