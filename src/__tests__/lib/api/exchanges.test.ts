/**
 * Exchange API Tests
 *
 * Tests for Exchange CRUD operations using the API client.
 */

import { rest } from 'msw';
import { server } from '../../mocks/server';
import { mockExchanges } from '../../mocks/data';
import {
  getExchanges,
  getExchange,
  createExchange,
  updateExchange,
  deleteExchange,
} from '@/lib/api/exchanges';
import { NotFoundError, ConflictError, ValidationError } from '@/lib/api/errors';
import type { Exchange } from '@/lib/types';

describe('Exchange API', () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  describe('getExchanges', () => {
    it('should return list of exchanges', async () => {
      const exchanges = await getExchanges();

      expect(exchanges).toBeInstanceOf(Array);
      expect(exchanges.length).toBeGreaterThan(0);
      expect(exchanges[0]).toHaveProperty('id');
      expect(exchanges[0]).toHaveProperty('name');
      expect(exchanges[0]).toHaveProperty('display_name');
      expect(exchanges[0]).toHaveProperty('created_at');
      expect(exchanges[0]).toHaveProperty('updated_at');
    });

    it('should return all mock exchanges', async () => {
      const exchanges = await getExchanges();

      expect(exchanges).toHaveLength(mockExchanges.length);
      expect(exchanges[0].name).toBe(mockExchanges[0].name);
      expect(exchanges[1].name).toBe(mockExchanges[1].name);
    });

    it('should handle empty list', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges`, () => {
          return res(ctx.json([]));
        })
      );

      const exchanges = await getExchanges();
      expect(exchanges).toEqual([]);
    });

    it('should handle API errors', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges`, () => {
          return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
        })
      );

      await expect(getExchanges()).rejects.toThrow();
    });
  });

  describe('getExchange', () => {
    it('should return single exchange by ID', async () => {
      const exchangeId = mockExchanges[0].id;
      const exchange = await getExchange(exchangeId);

      expect(exchange).toBeDefined();
      expect(exchange.id).toBe(exchangeId);
      expect(exchange.name).toBe(mockExchanges[0].name);
      expect(exchange.display_name).toBe(mockExchanges[0].display_name);
    });

    it('should include all required fields', async () => {
      const exchangeId = mockExchanges[0].id;
      const exchange = await getExchange(exchangeId);

      expect(exchange).toHaveProperty('id');
      expect(exchange).toHaveProperty('name');
      expect(exchange).toHaveProperty('display_name');
      expect(exchange).toHaveProperty('created_at');
      expect(exchange).toHaveProperty('updated_at');
    });

    it('should throw NotFoundError for nonexistent exchange', async () => {
      const nonexistentId = 'nonexistent-id-12345';

      await expect(getExchange(nonexistentId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with proper message', async () => {
      try {
        await getExchange('nonexistent-id');
        fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('Exchange not found');
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe('createExchange', () => {
    it('should create new exchange', async () => {
      const newExchangeData = {
        name: 'tcgplayer',
        display_name: 'TCGPlayer',
      };

      const created = await createExchange(newExchangeData);

      expect(created).toBeDefined();
      expect(created).toHaveProperty('id');
      expect(created.name).toBe(newExchangeData.name);
      expect(created.display_name).toBe(newExchangeData.display_name);
      expect(created).toHaveProperty('created_at');
      expect(created).toHaveProperty('updated_at');
    });

    it('should return exchange with generated ID', async () => {
      const newExchangeData = {
        name: 'ebay',
        display_name: 'eBay',
      };

      const created = await createExchange(newExchangeData);

      expect(created.id).toBeTruthy();
      expect(typeof created.id).toBe('string');
    });

    it('should throw ConflictError for duplicate name', async () => {
      const duplicateData = {
        name: mockExchanges[0].name, // Name that already exists
        display_name: 'Duplicate',
      };

      await expect(createExchange(duplicateData)).rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError with proper message', async () => {
      const duplicateData = {
        name: mockExchanges[0].name,
        display_name: 'Duplicate',
      };

      try {
        await createExchange(duplicateData);
        fail('Should have thrown ConflictError');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect((error as ConflictError).message).toContain('already exists');
        expect((error as ConflictError).statusCode).toBe(409);
      }
    });

    it('should handle validation errors', async () => {
      server.use(
        rest.post(`${baseUrl}/exchanges`, () => {
          return HttpResponse.json(
            {
              detail: [{ msg: 'Field required', loc: ['body', 'name'] }],
            },
            { status: 400 }
          );
        })
      );

      await expect(
        createExchange({ name: '', display_name: '' } as { name: string; display_name: string })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateExchange', () => {
    it('should update exchange display_name', async () => {
      const exchangeId = mockExchanges[0].id;
      const updates = {
        display_name: 'CardMarket EU',
      };

      const updated = await updateExchange(exchangeId, updates);

      expect(updated).toBeDefined();
      expect(updated.id).toBe(exchangeId);
      expect(updated.display_name).toBe(updates.display_name);
      expect(updated.name).toBe(mockExchanges[0].name); // Name should remain unchanged
    });

    it('should update exchange name', async () => {
      const exchangeId = mockExchanges[0].id;
      const updates = {
        name: 'cardmarket-new',
      };

      const updated = await updateExchange(exchangeId, updates);

      expect(updated.id).toBe(exchangeId);
      expect(updated.name).toBe(updates.name);
    });

    it('should update multiple fields', async () => {
      const exchangeId = mockExchanges[0].id;
      const updates = {
        name: 'cardmarket-updated',
        display_name: 'CardMarket Updated',
      };

      const updated = await updateExchange(exchangeId, updates);

      expect(updated.id).toBe(exchangeId);
      expect(updated.name).toBe(updates.name);
      expect(updated.display_name).toBe(updates.display_name);
    });

    it('should update the updated_at timestamp', async () => {
      const exchangeId = mockExchanges[0].id;
      const originalUpdatedAt = mockExchanges[0].updated_at;

      // Wait a bit to ensure timestamp will be different
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await updateExchange(exchangeId, { display_name: 'New Name' });

      expect(updated.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should throw NotFoundError for nonexistent exchange', async () => {
      const nonexistentId = 'nonexistent-id-12345';
      const updates = { display_name: 'New Name' };

      await expect(updateExchange(nonexistentId, updates)).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError when updating to duplicate name', async () => {
      const exchangeId = mockExchanges[0].id;
      const updates = {
        name: mockExchanges[1].name, // Try to use another exchange's name
      };

      await expect(updateExchange(exchangeId, updates)).rejects.toThrow(ConflictError);
    });

    it('should allow partial updates', async () => {
      const exchangeId = mockExchanges[0].id;
      const originalName = mockExchanges[0].name;

      const updated = await updateExchange(exchangeId, {
        display_name: 'Only Display Name Updated',
      });

      expect(updated.name).toBe(originalName);
      expect(updated.display_name).toBe('Only Display Name Updated');
    });
  });

  describe('deleteExchange', () => {
    it('should delete exchange successfully', async () => {
      const exchangeId = mockExchanges[0].id;

      await expect(deleteExchange(exchangeId)).resolves.toBeUndefined();
    });

    it('should remove exchange from list after deletion', async () => {
      const exchangeId = mockExchanges[0].id;

      await deleteExchange(exchangeId);

      // Try to get the deleted exchange
      await expect(getExchange(exchangeId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for nonexistent exchange', async () => {
      const nonexistentId = 'nonexistent-id-12345';

      await expect(deleteExchange(nonexistentId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with proper message', async () => {
      try {
        await deleteExchange('nonexistent-id');
        fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('Exchange not found');
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in exchange names', async () => {
      const specialCharsData = {
        name: 'exchange-with-dashes_and_underscores',
        display_name: 'Exchange with Spëcial Chàrs!',
      };

      const created = await createExchange(specialCharsData);

      expect(created.name).toBe(specialCharsData.name);
      expect(created.display_name).toBe(specialCharsData.display_name);
    });

    it('should handle very long display names', async () => {
      const longName = 'A'.repeat(255); // Max length
      const exchangeData = {
        name: 'long-name-exchange',
        display_name: longName,
      };

      const created = await createExchange(exchangeData);

      expect(created.display_name).toBe(longName);
    });

    it('should handle exchange with minimal data', async () => {
      const minimalData = {
        name: 'minimal',
        display_name: 'Min',
      };

      const created = await createExchange(minimalData);

      expect(created.name).toBe(minimalData.name);
      expect(created.display_name).toBe(minimalData.display_name);
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed Exchange objects', async () => {
      const exchange: Exchange = await getExchange(mockExchanges[0].id);

      // TypeScript should ensure these properties exist
      expect(typeof exchange.id).toBe('string');
      expect(typeof exchange.name).toBe('string');
      expect(typeof exchange.display_name).toBe('string');
      expect(typeof exchange.created_at).toBe('string');
      expect(typeof exchange.updated_at).toBe('string');
    });

    it('should accept properly typed create requests', async () => {
      const createRequest = {
        name: 'typed-exchange',
        display_name: 'Typed Exchange',
      };

      const created = await createExchange(createRequest);
      expect(created).toBeDefined();
    });

    it('should accept properly typed update requests', async () => {
      const updateRequest = {
        display_name: 'Updated Display Name',
      };

      const updated = await updateExchange(mockExchanges[0].id, updateRequest);
      expect(updated).toBeDefined();
    });
  });
});
