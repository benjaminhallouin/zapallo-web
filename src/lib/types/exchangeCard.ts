/**
 * ExchangeCard types
 * 
 * Types for ExchangeCard entity - represents a card listing on an
 * external trading platform.
 */

import { TimestampFields } from './api';

/**
 * ExchangeCard entity
 * 
 * Represents a card as listed on an external platform.
 * Contains intrinsic card data as represented by the platform,
 * which may differ from canonical card data.
 */
export interface ExchangeCard extends TimestampFields {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Foreign key to Exchange (UUID) */
  exchange_id: string;
  
  /** External platform card ID (max 255 chars) */
  external_card_id: string;
  
  /** Card name as shown on platform (max 255 chars) */
  name: string;
  
  /** Set name as shown on platform (max 255 chars) */
  set_name: string;
  
  /** Language string from platform (max 50 chars) */
  language: string;
  
  /** Rarity string from platform (max 50 chars, nullable) */
  rarity: string | null;
  
  /** Whether the card is foil */
  is_foil: boolean;
  
  /** Foreign key to CardImage for front image (UUID, nullable) */
  image_front_id: string | null;
  
  /** Foreign key to CardImage for back image (UUID, nullable) */
  image_back_id: string | null;
  
  /** Foreign key to canonical Card (UUID, nullable until matched) */
  card_id: string | null;
}

/**
 * Request body for creating a new exchange card
 */
export interface CreateExchangeCardRequest {
  /** Foreign key to Exchange (UUID) */
  exchange_id: string;
  
  /** External platform card ID (max 255 chars) */
  external_card_id: string;
  
  /** Card name as shown on platform (max 255 chars) */
  name: string;
  
  /** Set name as shown on platform (max 255 chars) */
  set_name: string;
  
  /** Language string from platform (max 50 chars) */
  language: string;
  
  /** Rarity string from platform (max 50 chars, optional) */
  rarity?: string | null;
  
  /** Whether the card is foil */
  is_foil: boolean;
  
  /** Foreign key to CardImage for front image (UUID, optional) */
  image_front_id?: string | null;
  
  /** Foreign key to CardImage for back image (UUID, optional) */
  image_back_id?: string | null;
  
  /** Foreign key to canonical Card (UUID, optional) */
  card_id?: string | null;
}

/**
 * Request body for updating an exchange card
 * 
 * All fields are optional for partial updates
 */
export interface UpdateExchangeCardRequest {
  /** Foreign key to Exchange (UUID) */
  exchange_id?: string;
  
  /** External platform card ID (max 255 chars) */
  external_card_id?: string;
  
  /** Card name as shown on platform (max 255 chars) */
  name?: string;
  
  /** Set name as shown on platform (max 255 chars) */
  set_name?: string;
  
  /** Language string from platform (max 50 chars) */
  language?: string;
  
  /** Rarity string from platform (max 50 chars) */
  rarity?: string | null;
  
  /** Whether the card is foil */
  is_foil?: boolean;
  
  /** Foreign key to CardImage for front image (UUID) */
  image_front_id?: string | null;
  
  /** Foreign key to CardImage for back image (UUID) */
  image_back_id?: string | null;
  
  /** Foreign key to canonical Card (UUID) */
  card_id?: string | null;
}

/**
 * Type guard to check if an object is an ExchangeCard
 * 
 * @param obj - Object to check
 * @returns True if object matches ExchangeCard interface
 */
export function isExchangeCard(obj: unknown): obj is ExchangeCard {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.exchange_id === 'string' &&
    typeof candidate.external_card_id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.set_name === 'string' &&
    typeof candidate.language === 'string' &&
    (candidate.rarity === null || typeof candidate.rarity === 'string') &&
    typeof candidate.is_foil === 'boolean' &&
    (candidate.image_front_id === null || typeof candidate.image_front_id === 'string') &&
    (candidate.image_back_id === null || typeof candidate.image_back_id === 'string') &&
    (candidate.card_id === null || typeof candidate.card_id === 'string') &&
    typeof candidate.created_at === 'string' &&
    typeof candidate.updated_at === 'string'
  );
}
