/**
 * Mock data for API tests
 *
 * Provides fixture data for testing API client methods with MSW.
 */

import type { Exchange, ExchangeUser, ExchangeCard } from '@/lib/types';

/**
 * Mock exchanges
 */
export const mockExchanges: Exchange[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'cardmarket',
    display_name: 'CardMarket',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'playin',
    display_name: 'Play-in Games',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

/**
 * Mock exchange users
 */
export const mockExchangeUsers: ExchangeUser[] = [
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    exchange_id: '123e4567-e89b-12d3-a456-426614174001',
    external_user_id: 'ext-user-123',
    name: 'john_seller',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174002',
    exchange_id: '123e4567-e89b-12d3-a456-426614174002',
    external_user_id: 'ext-user-456',
    name: 'jane_buyer',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

/**
 * Mock exchange cards
 */
export const mockExchangeCards: ExchangeCard[] = [
  {
    id: '323e4567-e89b-12d3-a456-426614174001',
    exchange_id: '123e4567-e89b-12d3-a456-426614174001',
    external_card_id: 'ext-card-789',
    name: 'Black Lotus',
    set_name: 'Alpha',
    language: 'English',
    rarity: 'Rare',
    is_foil: false,
    image_front_id: null,
    image_back_id: null,
    card_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '323e4567-e89b-12d3-a456-426614174002',
    exchange_id: '123e4567-e89b-12d3-a456-426614174002',
    external_card_id: 'ext-card-101',
    name: 'Lightning Bolt',
    set_name: 'Beta',
    language: 'English',
    rarity: 'Common',
    is_foil: true,
    image_front_id: null,
    image_back_id: null,
    card_id: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];
