/**
 * ExchangeCard API Tests
 *
 * Tests for ExchangeCard CRUD operations using the API client.
 */

import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { mockExchangeCards, mockExchanges } from '../../mocks/data';
import {
  getExchangeCards,
  getExchangeCard,
  createExchangeCard,
  updateExchangeCard,
  deleteExchangeCard,
} from '@/lib/api/exchangeCards';
import { NotFoundError, ValidationError } from '@/lib/api/errors';
import type { ExchangeCard } from '@/lib/types';

describe('ExchangeCard API', () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  describe('getExchangeCards', () => {
    it('should return list of exchange cards', async () => {
      const cards = await getExchangeCards();

      expect(cards).toBeInstanceOf(Array);
      expect(cards.length).toBeGreaterThan(0);
      expect(cards[0]).toHaveProperty('id');
      expect(cards[0]).toHaveProperty('exchange_id');
      expect(cards[0]).toHaveProperty('external_card_id');
      expect(cards[0]).toHaveProperty('name');
      expect(cards[0]).toHaveProperty('set_name');
      expect(cards[0]).toHaveProperty('language');
      expect(cards[0]).toHaveProperty('is_foil');
      expect(cards[0]).toHaveProperty('created_at');
      expect(cards[0]).toHaveProperty('updated_at');
    });

    it('should return all mock exchange cards', async () => {
      const cards = await getExchangeCards();

      expect(cards).toHaveLength(mockExchangeCards.length);
      expect(cards[0].name).toBe(mockExchangeCards[0].name);
      expect(cards[1].name).toBe(mockExchangeCards[1].name);
    });

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/exchange_cards`, () => {
          return HttpResponse.json([]);
        })
      );

      const cards = await getExchangeCards();
      expect(cards).toEqual([]);
    });

    it('should handle API errors', async () => {
      server.use(
        http.get(`${baseUrl}/exchange_cards`, () => {
          return HttpResponse.json({ detail: 'Internal server error' }, { status: 500 });
        })
      );

      await expect(getExchangeCards()).rejects.toThrow();
    });
  });

  describe('getExchangeCard', () => {
    it('should return single exchange card by ID', async () => {
      const cardId = mockExchangeCards[0].id;
      const card = await getExchangeCard(cardId);

      expect(card).toBeDefined();
      expect(card.id).toBe(cardId);
      expect(card.name).toBe(mockExchangeCards[0].name);
      expect(card.set_name).toBe(mockExchangeCards[0].set_name);
      expect(card.exchange_id).toBe(mockExchangeCards[0].exchange_id);
      expect(card.external_card_id).toBe(mockExchangeCards[0].external_card_id);
    });

    it('should include all required fields', async () => {
      const cardId = mockExchangeCards[0].id;
      const card = await getExchangeCard(cardId);

      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('exchange_id');
      expect(card).toHaveProperty('external_card_id');
      expect(card).toHaveProperty('name');
      expect(card).toHaveProperty('set_name');
      expect(card).toHaveProperty('language');
      expect(card).toHaveProperty('rarity');
      expect(card).toHaveProperty('is_foil');
      expect(card).toHaveProperty('image_front_id');
      expect(card).toHaveProperty('image_back_id');
      expect(card).toHaveProperty('card_id');
      expect(card).toHaveProperty('created_at');
      expect(card).toHaveProperty('updated_at');
    });

    it('should handle nullable fields correctly', async () => {
      const card = await getExchangeCard(mockExchangeCards[0].id);

      // These fields can be null
      expect(card.rarity === null || typeof card.rarity === 'string').toBe(true);
      expect(card.image_front_id === null || typeof card.image_front_id === 'string').toBe(true);
      expect(card.image_back_id === null || typeof card.image_back_id === 'string').toBe(true);
      expect(card.card_id === null || typeof card.card_id === 'string').toBe(true);
    });

    it('should throw NotFoundError for nonexistent card', async () => {
      const nonexistentId = 'nonexistent-card-id-12345';

      await expect(getExchangeCard(nonexistentId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with proper message', async () => {
      try {
        await getExchangeCard('nonexistent-id');
        fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('ExchangeCard not found');
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe('createExchangeCard', () => {
    it('should create new exchange card', async () => {
      const newCardData = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-card-new-123',
        name: 'Mox Sapphire',
        set_name: 'Beta',
        language: 'English',
        is_foil: false,
      };

      const created = await createExchangeCard(newCardData);

      expect(created).toBeDefined();
      expect(created).toHaveProperty('id');
      expect(created.exchange_id).toBe(newCardData.exchange_id);
      expect(created.external_card_id).toBe(newCardData.external_card_id);
      expect(created.name).toBe(newCardData.name);
      expect(created.set_name).toBe(newCardData.set_name);
      expect(created.language).toBe(newCardData.language);
      expect(created.is_foil).toBe(newCardData.is_foil);
      expect(created).toHaveProperty('created_at');
      expect(created).toHaveProperty('updated_at');
    });

    it('should return card with generated ID', async () => {
      const newCardData = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-card-new-456',
        name: 'Time Walk',
        set_name: 'Alpha',
        language: 'English',
        is_foil: false,
      };

      const created = await createExchangeCard(newCardData);

      expect(created.id).toBeTruthy();
      expect(typeof created.id).toBe('string');
    });

    it('should create card with optional rarity', async () => {
      const cardWithRarity = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-card-rarity-123',
        name: 'Ancestral Recall',
        set_name: 'Alpha',
        language: 'English',
        rarity: 'Rare',
        is_foil: false,
      };

      const created = await createExchangeCard(cardWithRarity);

      expect(created.rarity).toBe('Rare');
    });

    it('should create card without optional fields', async () => {
      const minimalCard = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-card-minimal-123',
        name: 'Lightning Bolt',
        set_name: 'Alpha',
        language: 'English',
        is_foil: false,
      };

      const created = await createExchangeCard(minimalCard);

      expect(created.rarity).toBeNull();
      expect(created.image_front_id).toBeNull();
      expect(created.image_back_id).toBeNull();
      expect(created.card_id).toBeNull();
    });

    it('should create foil card', async () => {
      const foilCard = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-card-foil-123',
        name: 'Foil Lightning Bolt',
        set_name: 'Modern Masters',
        language: 'English',
        is_foil: true,
      };

      const created = await createExchangeCard(foilCard);

      expect(created.is_foil).toBe(true);
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post(`${baseUrl}/exchange_cards`, () => {
          return HttpResponse.json(
            {
              detail: [
                { msg: 'Field required', loc: ['body', 'exchange_id'] },
                { msg: 'Field required', loc: ['body', 'name'] },
              ],
            },
            { status: 400 }
          );
        })
      );

      await expect(
        createExchangeCard({
          exchange_id: '',
          external_card_id: '',
          name: '',
          set_name: '',
          language: '',
          is_foil: false,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateExchangeCard', () => {
    it('should update card name', async () => {
      const cardId = mockExchangeCards[0].id;
      const updates = {
        name: 'Black Lotus (Alpha Edition)',
      };

      const updated = await updateExchangeCard(cardId, updates);

      expect(updated).toBeDefined();
      expect(updated.id).toBe(cardId);
      expect(updated.name).toBe(updates.name);
      // Other fields should remain unchanged
      expect(updated.exchange_id).toBe(mockExchangeCards[0].exchange_id);
      expect(updated.set_name).toBe(mockExchangeCards[0].set_name);
    });

    it('should update rarity', async () => {
      const cardId = mockExchangeCards[0].id;
      const updates = {
        rarity: 'Mythic Rare',
      };

      const updated = await updateExchangeCard(cardId, updates);

      expect(updated.id).toBe(cardId);
      expect(updated.rarity).toBe(updates.rarity);
    });

    it('should update is_foil status', async () => {
      const cardId = mockExchangeCards[0].id;
      const updates = {
        is_foil: true,
      };

      const updated = await updateExchangeCard(cardId, updates);

      expect(updated.id).toBe(cardId);
      expect(updated.is_foil).toBe(true);
    });

    it('should update multiple fields', async () => {
      const cardId = mockExchangeCards[0].id;
      const updates = {
        name: 'Updated Card Name',
        set_name: 'Updated Set',
        language: 'French',
        rarity: 'Uncommon',
      };

      const updated = await updateExchangeCard(cardId, updates);

      expect(updated.id).toBe(cardId);
      expect(updated.name).toBe(updates.name);
      expect(updated.set_name).toBe(updates.set_name);
      expect(updated.language).toBe(updates.language);
      expect(updated.rarity).toBe(updates.rarity);
    });

    it('should update the updated_at timestamp', async () => {
      const cardId = mockExchangeCards[0].id;
      const originalUpdatedAt = mockExchangeCards[0].updated_at;

      // Wait a bit to ensure timestamp will be different
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await updateExchangeCard(cardId, { name: 'New Name' });

      expect(updated.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should throw NotFoundError for nonexistent card', async () => {
      const nonexistentId = 'nonexistent-card-id-12345';
      const updates = { name: 'New Name' };

      await expect(updateExchangeCard(nonexistentId, updates)).rejects.toThrow(NotFoundError);
    });

    it('should allow partial updates', async () => {
      const cardId = mockExchangeCards[0].id;
      const originalSetName = mockExchangeCards[0].set_name;
      const originalLanguage = mockExchangeCards[0].language;

      const updated = await updateExchangeCard(cardId, {
        name: 'Only Name Updated',
      });

      expect(updated.set_name).toBe(originalSetName);
      expect(updated.language).toBe(originalLanguage);
      expect(updated.name).toBe('Only Name Updated');
    });

    it('should update nullable fields to null', async () => {
      const cardId = mockExchangeCards[0].id;
      const updates = {
        rarity: null,
      };

      const updated = await updateExchangeCard(cardId, updates);

      expect(updated.rarity).toBeNull();
    });
  });

  describe('deleteExchangeCard', () => {
    it('should delete exchange card successfully', async () => {
      const cardId = mockExchangeCards[0].id;

      await expect(deleteExchangeCard(cardId)).resolves.toBeUndefined();
    });

    it('should remove card from list after deletion', async () => {
      const cardId = mockExchangeCards[0].id;

      await deleteExchangeCard(cardId);

      // Try to get the deleted card
      await expect(getExchangeCard(cardId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for nonexistent card', async () => {
      const nonexistentId = 'nonexistent-card-id-12345';

      await expect(deleteExchangeCard(nonexistentId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with proper message', async () => {
      try {
        await deleteExchangeCard('nonexistent-id');
        fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('ExchangeCard not found');
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in card names', async () => {
      const specialCharsData = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-special-123',
        name: 'Card: With "Special" Characters & More!',
        set_name: 'Set (2024)',
        language: 'English',
        is_foil: false,
      };

      const created = await createExchangeCard(specialCharsData);

      expect(created.name).toBe(specialCharsData.name);
      expect(created.set_name).toBe(specialCharsData.set_name);
    });

    it('should handle very long card names', async () => {
      const longName = 'C'.repeat(255); // Max length
      const cardData = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'ext-long-name-123',
        name: longName,
        set_name: 'Test Set',
        language: 'English',
        is_foil: false,
      };

      const created = await createExchangeCard(cardData);

      expect(created.name).toBe(longName);
    });

    it('should handle various language codes', async () => {
      const languages = ['English', 'French', 'German', 'Japanese', 'Spanish'];

      for (const language of languages) {
        const cardData = {
          exchange_id: mockExchanges[0].id,
          external_card_id: `ext-lang-${language}-123`,
          name: `Card in ${language}`,
          set_name: 'Multilingual Set',
          language,
          is_foil: false,
        };

        const created = await createExchangeCard(cardData);

        expect(created.language).toBe(language);
      }
    });

    it('should handle card with minimal data', async () => {
      const minimalData = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'm',
        name: 'M',
        set_name: 'S',
        language: 'E',
        is_foil: false,
      };

      const created = await createExchangeCard(minimalData);

      expect(created.name).toBe(minimalData.name);
      expect(created.set_name).toBe(minimalData.set_name);
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed ExchangeCard objects', async () => {
      const card: ExchangeCard = await getExchangeCard(mockExchangeCards[0].id);

      // TypeScript should ensure these properties exist
      expect(typeof card.id).toBe('string');
      expect(typeof card.exchange_id).toBe('string');
      expect(typeof card.external_card_id).toBe('string');
      expect(typeof card.name).toBe('string');
      expect(typeof card.set_name).toBe('string');
      expect(typeof card.language).toBe('string');
      expect(typeof card.is_foil).toBe('boolean');
      expect(typeof card.created_at).toBe('string');
      expect(typeof card.updated_at).toBe('string');
    });

    it('should accept properly typed create requests', async () => {
      const createRequest = {
        exchange_id: mockExchanges[0].id,
        external_card_id: 'typed-card-123',
        name: 'Typed Card',
        set_name: 'Typed Set',
        language: 'English',
        is_foil: false,
      };

      const created = await createExchangeCard(createRequest);
      expect(created).toBeDefined();
    });

    it('should accept properly typed update requests', async () => {
      const updateRequest = {
        name: 'Updated Card Name',
        rarity: 'Rare',
      };

      const updated = await updateExchangeCard(mockExchangeCards[0].id, updateRequest);
      expect(updated).toBeDefined();
    });
  });

  describe('Relationships', () => {
    it('should preserve exchange_id relationship', async () => {
      const card = await getExchangeCard(mockExchangeCards[0].id);

      // Verify the exchange_id is a valid UUID format
      expect(card.exchange_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('should allow multiple cards for same exchange', async () => {
      const exchangeId = mockExchanges[0].id;

      const card1 = await createExchangeCard({
        exchange_id: exchangeId,
        external_card_id: 'ext-card-multi-1',
        name: 'Multi Card 1',
        set_name: 'Test Set',
        language: 'English',
        is_foil: false,
      });

      const card2 = await createExchangeCard({
        exchange_id: exchangeId,
        external_card_id: 'ext-card-multi-2',
        name: 'Multi Card 2',
        set_name: 'Test Set',
        language: 'English',
        is_foil: false,
      });

      expect(card1.exchange_id).toBe(exchangeId);
      expect(card2.exchange_id).toBe(exchangeId);
      expect(card1.id).not.toBe(card2.id);
    });

    it('should handle foil and non-foil versions of same card', async () => {
      const exchangeId = mockExchanges[0].id;

      const nonFoil = await createExchangeCard({
        exchange_id: exchangeId,
        external_card_id: 'ext-card-nonfoil-123',
        name: 'Lightning Bolt',
        set_name: 'Beta',
        language: 'English',
        is_foil: false,
      });

      const foil = await createExchangeCard({
        exchange_id: exchangeId,
        external_card_id: 'ext-card-foil-123',
        name: 'Lightning Bolt',
        set_name: 'Beta',
        language: 'English',
        is_foil: true,
      });

      expect(nonFoil.is_foil).toBe(false);
      expect(foil.is_foil).toBe(true);
      expect(nonFoil.id).not.toBe(foil.id);
    });
  });
});
