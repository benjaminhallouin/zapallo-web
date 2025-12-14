/**
 * ExchangeUser types
 * 
 * Types for ExchangeUser entity - represents a user account on a
 * specific trading platform (seller/buyer).
 */

import { TimestampFields } from './api';

/**
 * ExchangeUser entity
 * 
 * Represents a user account on a trading platform.
 * The same physical person may have multiple ExchangeUser records
 * if they have accounts on different platforms.
 */
export interface ExchangeUser extends TimestampFields {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Foreign key to Exchange (UUID) */
  exchange_id: string;
  
  /** External platform user ID (max 255 chars) */
  external_user_id: string;
  
  /** Username on the platform (max 255 chars) */
  name: string;
}

/**
 * Request body for creating a new exchange user
 */
export interface CreateExchangeUserRequest {
  /** Foreign key to Exchange (UUID) */
  exchange_id: string;
  
  /** External platform user ID (max 255 chars) */
  external_user_id: string;
  
  /** Username on the platform (max 255 chars) */
  name: string;
}

/**
 * Request body for updating an exchange user
 * 
 * All fields are optional for partial updates
 */
export interface UpdateExchangeUserRequest {
  /** Foreign key to Exchange (UUID) */
  exchange_id?: string;
  
  /** External platform user ID (max 255 chars) */
  external_user_id?: string;
  
  /** Username on the platform (max 255 chars) */
  name?: string;
}

/**
 * Type guard to check if an object is an ExchangeUser
 * 
 * @param obj - Object to check
 * @returns True if object matches ExchangeUser interface
 */
export function isExchangeUser(obj: unknown): obj is ExchangeUser {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.exchange_id === 'string' &&
    typeof candidate.external_user_id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.created_at === 'string' &&
    typeof candidate.updated_at === 'string'
  );
}
