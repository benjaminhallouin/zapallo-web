/**
 * Exchange types
 *
 * Types for Exchange entity - represents a trading platform
 * where cards can be bought and sold (e.g., CardMarket, Play-in, eBay).
 */

import { TimestampFields } from './api';

/**
 * Exchange entity
 *
 * Represents a marketplace or trading platform.
 */
export interface Exchange extends TimestampFields {
  /** Unique identifier (UUID) */
  id: string;

  /** Unique internal name (e.g., "cardmarket") */
  name: string;

  /** Display name for UI (e.g., "CardMarket") */
  display_name: string;
}

/**
 * Request body for creating a new exchange
 */
export interface CreateExchangeRequest {
  /** Unique internal name (max 100 chars) */
  name: string;

  /** Display name for UI (max 255 chars) */
  display_name: string;
}

/**
 * Request body for updating an exchange
 *
 * All fields are optional for partial updates
 */
export interface UpdateExchangeRequest {
  /** Unique internal name (max 100 chars) */
  name?: string;

  /** Display name for UI (max 255 chars) */
  display_name?: string;
}

/**
 * Type guard to check if an object is an Exchange
 *
 * @param obj - Object to check
 * @returns True if object matches Exchange interface
 */
export function isExchange(obj: unknown): obj is Exchange {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.display_name === 'string' &&
    typeof candidate.created_at === 'string' &&
    typeof candidate.updated_at === 'string'
  );
}
