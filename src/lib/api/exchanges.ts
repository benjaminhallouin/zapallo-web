/**
 * Exchange API methods
 *
 * API methods for managing Exchange entities.
 * Provides CRUD operations for exchanges (trading platforms).
 */

import { apiClient } from './client';
import type { Exchange, CreateExchangeRequest, UpdateExchangeRequest } from '../types/exchange';

/**
 * API endpoints for exchanges
 */
const ENDPOINTS = {
  base: '/exchanges',
  byId: (id: string) => `/exchanges/${id}`,
} as const;

/**
 * Get all exchanges
 *
 * @returns Array of all exchanges
 * @throws {ApiError} On API errors
 *
 * @example
 * ```typescript
 * const exchanges = await getExchanges();
 * console.log(exchanges); // [{ id: '...', name: 'cardmarket', ... }]
 * ```
 */
export async function getExchanges(): Promise<Exchange[]> {
  return apiClient.get<Exchange[]>(ENDPOINTS.base);
}

/**
 * Get a single exchange by ID
 *
 * @param id - Exchange UUID
 * @returns Exchange details
 * @throws {NotFoundError} If exchange doesn't exist
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const exchange = await getExchange('123e4567-e89b-12d3-a456-426614174000');
 * console.log(exchange.name); // 'cardmarket'
 * ```
 */
export async function getExchange(id: string): Promise<Exchange> {
  return apiClient.get<Exchange>(ENDPOINTS.byId(id));
}

/**
 * Create a new exchange
 *
 * @param data - Exchange creation data
 * @returns Created exchange with generated ID and timestamps
 * @throws {ValidationError} If data is invalid
 * @throws {ConflictError} If exchange with same name already exists
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const newExchange = await createExchange({
 *   name: 'cardmarket',
 *   display_name: 'CardMarket'
 * });
 * console.log(newExchange.id); // '123e4567-...'
 * ```
 */
export async function createExchange(data: CreateExchangeRequest): Promise<Exchange> {
  return apiClient.post<Exchange>(ENDPOINTS.base, data);
}

/**
 * Update an existing exchange
 *
 * @param id - Exchange UUID
 * @param data - Partial update data (only changed fields)
 * @returns Updated exchange
 * @throws {NotFoundError} If exchange doesn't exist
 * @throws {ValidationError} If data is invalid
 * @throws {ConflictError} If name conflicts with another exchange
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const updated = await updateExchange('123e4567-...', {
 *   display_name: 'CardMarket EU'
 * });
 * console.log(updated.display_name); // 'CardMarket EU'
 * ```
 */
export async function updateExchange(id: string, data: UpdateExchangeRequest): Promise<Exchange> {
  return apiClient.patch<Exchange>(ENDPOINTS.byId(id), data);
}

/**
 * Delete an exchange
 *
 * @param id - Exchange UUID
 * @throws {NotFoundError} If exchange doesn't exist
 * @throws {ConflictError} If exchange has related records (users, cards)
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * await deleteExchange('123e4567-...');
 * // Exchange is deleted
 * ```
 */
export async function deleteExchange(id: string): Promise<void> {
  return apiClient.delete<void>(ENDPOINTS.byId(id));
}
