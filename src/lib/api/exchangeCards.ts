/**
 * ExchangeCard API methods
 *
 * API methods for managing ExchangeCard entities.
 * Provides CRUD operations for exchange cards (card listings on trading platforms).
 */

import { apiClient } from './client';
import type {
  ExchangeCard,
  CreateExchangeCardRequest,
  UpdateExchangeCardRequest,
} from '../types/exchangeCard';

/**
 * API endpoints for exchange cards
 */
const ENDPOINTS = {
  base: '/exchange_cards',
  byId: (id: string) => `/exchange_cards/${id}`,
} as const;

/**
 * Get all exchange cards
 *
 * @returns Array of all exchange cards
 * @throws {ApiError} On API errors
 *
 * @example
 * ```typescript
 * const cards = await getExchangeCards();
 * console.log(cards); // [{ id: '...', name: 'Black Lotus', ... }]
 * ```
 */
export async function getExchangeCards(): Promise<ExchangeCard[]> {
  return apiClient.get<ExchangeCard[]>(ENDPOINTS.base);
}

/**
 * Get a single exchange card by ID
 *
 * @param id - ExchangeCard UUID
 * @returns ExchangeCard details
 * @throws {NotFoundError} If exchange card doesn't exist
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const card = await getExchangeCard('123e4567-e89b-12d3-a456-426614174000');
 * console.log(card.name); // 'Black Lotus'
 * ```
 */
export async function getExchangeCard(id: string): Promise<ExchangeCard> {
  return apiClient.get<ExchangeCard>(ENDPOINTS.byId(id));
}

/**
 * Create a new exchange card
 *
 * @param data - ExchangeCard creation data
 * @returns Created exchange card with generated ID and timestamps
 * @throws {ValidationError} If data is invalid
 * @throws {NotFoundError} If referenced exchange doesn't exist
 * @throws {ConflictError} If card with same external_card_id already exists on that exchange
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const newCard = await createExchangeCard({
 *   exchange_id: '123e4567-...',
 *   external_card_id: 'ext_98765',
 *   name: 'Black Lotus',
 *   set_name: 'Alpha',
 *   language: 'English',
 *   is_foil: false
 * });
 * console.log(newCard.id); // '789e0123-...'
 * ```
 */
export async function createExchangeCard(data: CreateExchangeCardRequest): Promise<ExchangeCard> {
  return apiClient.post<ExchangeCard>(ENDPOINTS.base, data);
}

/**
 * Update an existing exchange card
 *
 * @param id - ExchangeCard UUID
 * @param data - Partial update data (only changed fields)
 * @returns Updated exchange card
 * @throws {NotFoundError} If exchange card doesn't exist
 * @throws {ValidationError} If data is invalid
 * @throws {ConflictError} If external_card_id conflicts with another card
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * const updated = await updateExchangeCard('789e0123-...', {
 *   name: 'Black Lotus (Alpha)',
 *   rarity: 'Rare'
 * });
 * console.log(updated.name); // 'Black Lotus (Alpha)'
 * ```
 */
export async function updateExchangeCard(
  id: string,
  data: UpdateExchangeCardRequest
): Promise<ExchangeCard> {
  return apiClient.put<ExchangeCard>(ENDPOINTS.byId(id), data);
}

/**
 * Delete an exchange card
 *
 * @param id - ExchangeCard UUID
 * @throws {NotFoundError} If exchange card doesn't exist
 * @throws {ConflictError} If exchange card has related records
 * @throws {ApiError} On other API errors
 *
 * @example
 * ```typescript
 * await deleteExchangeCard('789e0123-...');
 * // Exchange card is deleted
 * ```
 */
export async function deleteExchangeCard(id: string): Promise<void> {
  return apiClient.delete<void>(ENDPOINTS.byId(id));
}
