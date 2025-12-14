/**
 * Tests for type guards
 */

import {
  isExchange,
  isExchangeUser,
  isExchangeCard,
  type Exchange,
  type ExchangeUser,
  type ExchangeCard,
} from '@/lib/types';

describe('Type Guards', () => {
  describe('isExchange', () => {
    it('should return true for valid Exchange object', () => {
      const validExchange: Exchange = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'cardmarket',
        display_name: 'CardMarket',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchange(validExchange)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isExchange(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isExchange(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(isExchange('string')).toBe(false);
      expect(isExchange(123)).toBe(false);
      expect(isExchange(true)).toBe(false);
    });

    it('should return false for object missing id', () => {
      const invalid = {
        name: 'cardmarket',
        display_name: 'CardMarket',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchange(invalid)).toBe(false);
    });

    it('should return false for object missing name', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        display_name: 'CardMarket',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchange(invalid)).toBe(false);
    });

    it('should return false for object missing display_name', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'cardmarket',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchange(invalid)).toBe(false);
    });

    it('should return false for object missing timestamps', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'cardmarket',
        display_name: 'CardMarket',
      };

      expect(isExchange(invalid)).toBe(false);
    });

    it('should return false for object with wrong field types', () => {
      const invalid = {
        id: 123, // should be string
        name: 'cardmarket',
        display_name: 'CardMarket',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchange(invalid)).toBe(false);
    });
  });

  describe('isExchangeUser', () => {
    it('should return true for valid ExchangeUser object', () => {
      const validUser: ExchangeUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        external_user_id: 'user123',
        name: 'John Doe',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeUser(validUser)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isExchangeUser(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isExchangeUser(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(isExchangeUser('string')).toBe(false);
      expect(isExchangeUser(123)).toBe(false);
      expect(isExchangeUser(true)).toBe(false);
    });

    it('should return false for object missing exchange_id', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        external_user_id: 'user123',
        name: 'John Doe',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeUser(invalid)).toBe(false);
    });

    it('should return false for object missing external_user_id', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'John Doe',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeUser(invalid)).toBe(false);
    });

    it('should return false for object with wrong field types', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: 123, // should be string
        external_user_id: 'user123',
        name: 'John Doe',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeUser(invalid)).toBe(false);
    });
  });

  describe('isExchangeCard', () => {
    it('should return true for valid ExchangeCard object', () => {
      const validCard: ExchangeCard = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        external_card_id: 'card123',
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
      };

      expect(isExchangeCard(validCard)).toBe(true);
    });

    it('should return true for ExchangeCard with null optional fields', () => {
      const validCard: ExchangeCard = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        external_card_id: 'card123',
        name: 'Black Lotus',
        set_name: 'Alpha',
        language: 'English',
        rarity: null,
        is_foil: true,
        image_front_id: null,
        image_back_id: null,
        card_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeCard(validCard)).toBe(true);
    });

    it('should return true for ExchangeCard with all optional fields populated', () => {
      const validCard: ExchangeCard = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        external_card_id: 'card123',
        name: 'Black Lotus',
        set_name: 'Alpha',
        language: 'English',
        rarity: 'Rare',
        is_foil: false,
        image_front_id: '550e8400-e29b-41d4-a716-446655440002',
        image_back_id: '550e8400-e29b-41d4-a716-446655440003',
        card_id: '550e8400-e29b-41d4-a716-446655440004',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeCard(validCard)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isExchangeCard(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isExchangeCard(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(isExchangeCard('string')).toBe(false);
      expect(isExchangeCard(123)).toBe(false);
      expect(isExchangeCard(true)).toBe(false);
    });

    it('should return false for object missing required fields', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        // missing external_card_id
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
      };

      expect(isExchangeCard(invalid)).toBe(false);
    });

    it('should return false for object with wrong field types', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        external_card_id: 'card123',
        name: 'Black Lotus',
        set_name: 'Alpha',
        language: 'English',
        rarity: 'Rare',
        is_foil: 'false', // should be boolean
        image_front_id: null,
        image_back_id: null,
        card_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeCard(invalid)).toBe(false);
    });

    it('should return false when nullable field has wrong type', () => {
      const invalid = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        exchange_id: '550e8400-e29b-41d4-a716-446655440001',
        external_card_id: 'card123',
        name: 'Black Lotus',
        set_name: 'Alpha',
        language: 'English',
        rarity: 123, // should be string or null
        is_foil: false,
        image_front_id: null,
        image_back_id: null,
        card_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(isExchangeCard(invalid)).toBe(false);
    });
  });
});
