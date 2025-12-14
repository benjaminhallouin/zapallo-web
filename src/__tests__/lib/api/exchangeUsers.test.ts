/**
 * ExchangeUser API Tests
 *
 * Tests for ExchangeUser CRUD operations using the API client.
 */

import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { mockExchangeUsers, mockExchanges } from '../../mocks/data';
import {
  getExchangeUsers,
  getExchangeUser,
  createExchangeUser,
  updateExchangeUser,
  deleteExchangeUser,
} from '@/lib/api/exchangeUsers';
import { NotFoundError, ValidationError } from '@/lib/api/errors';
import type { ExchangeUser } from '@/lib/types';

describe('ExchangeUser API', () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  describe('getExchangeUsers', () => {
    it('should return list of exchange users', async () => {
      const users = await getExchangeUsers();

      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('exchange_id');
      expect(users[0]).toHaveProperty('external_user_id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('created_at');
      expect(users[0]).toHaveProperty('updated_at');
    });

    it('should return all mock exchange users', async () => {
      const users = await getExchangeUsers();

      expect(users).toHaveLength(mockExchangeUsers.length);
      expect(users[0].name).toBe(mockExchangeUsers[0].name);
      expect(users[1].name).toBe(mockExchangeUsers[1].name);
    });

    it('should handle empty list', async () => {
      server.use(
        http.get(`${baseUrl}/exchange_users`, () => {
          return HttpResponse.json([]);
        })
      );

      const users = await getExchangeUsers();
      expect(users).toEqual([]);
    });

    it('should handle API errors', async () => {
      server.use(
        http.get(`${baseUrl}/exchange_users`, () => {
          return HttpResponse.json({ detail: 'Internal server error' }, { status: 500 });
        })
      );

      await expect(getExchangeUsers()).rejects.toThrow();
    });
  });

  describe('getExchangeUser', () => {
    it('should return single exchange user by ID', async () => {
      const userId = mockExchangeUsers[0].id;
      const user = await getExchangeUser(userId);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
      expect(user.name).toBe(mockExchangeUsers[0].name);
      expect(user.exchange_id).toBe(mockExchangeUsers[0].exchange_id);
      expect(user.external_user_id).toBe(mockExchangeUsers[0].external_user_id);
    });

    it('should include all required fields', async () => {
      const userId = mockExchangeUsers[0].id;
      const user = await getExchangeUser(userId);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('exchange_id');
      expect(user).toHaveProperty('external_user_id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('created_at');
      expect(user).toHaveProperty('updated_at');
    });

    it('should throw NotFoundError for nonexistent user', async () => {
      const nonexistentId = 'nonexistent-user-id-12345';

      await expect(getExchangeUser(nonexistentId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with proper message', async () => {
      try {
        await getExchangeUser('nonexistent-id');
        fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('ExchangeUser not found');
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe('createExchangeUser', () => {
    it('should create new exchange user', async () => {
      const newUserData = {
        exchange_id: mockExchanges[0].id,
        external_user_id: 'ext-user-new-123',
        name: 'new_seller',
      };

      const created = await createExchangeUser(newUserData);

      expect(created).toBeDefined();
      expect(created).toHaveProperty('id');
      expect(created.exchange_id).toBe(newUserData.exchange_id);
      expect(created.external_user_id).toBe(newUserData.external_user_id);
      expect(created.name).toBe(newUserData.name);
      expect(created).toHaveProperty('created_at');
      expect(created).toHaveProperty('updated_at');
    });

    it('should return user with generated ID', async () => {
      const newUserData = {
        exchange_id: mockExchanges[0].id,
        external_user_id: 'ext-user-new-456',
        name: 'another_user',
      };

      const created = await createExchangeUser(newUserData);

      expect(created.id).toBeTruthy();
      expect(typeof created.id).toBe('string');
    });

    it('should create user with valid exchange_id reference', async () => {
      const newUserData = {
        exchange_id: mockExchanges[1].id,
        external_user_id: 'ext-user-789',
        name: 'playin_user',
      };

      const created = await createExchangeUser(newUserData);

      expect(created.exchange_id).toBe(mockExchanges[1].id);
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post(`${baseUrl}/exchange_users`, () => {
          return HttpResponse.json(
            {
              detail: [
                { msg: 'Field required', loc: ['body', 'exchange_id'] },
                { msg: 'Field required', loc: ['body', 'external_user_id'] },
              ],
            },
            { status: 400 }
          );
        })
      );

      await expect(
        createExchangeUser({
          exchange_id: '',
          external_user_id: '',
          name: '',
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateExchangeUser', () => {
    it('should update exchange user name', async () => {
      const userId = mockExchangeUsers[0].id;
      const updates = {
        name: 'updated_seller_name',
      };

      const updated = await updateExchangeUser(userId, updates);

      expect(updated).toBeDefined();
      expect(updated.id).toBe(userId);
      expect(updated.name).toBe(updates.name);
      // Other fields should remain unchanged
      expect(updated.exchange_id).toBe(mockExchangeUsers[0].exchange_id);
      expect(updated.external_user_id).toBe(mockExchangeUsers[0].external_user_id);
    });

    it('should update external_user_id', async () => {
      const userId = mockExchangeUsers[0].id;
      const updates = {
        external_user_id: 'ext-user-updated-999',
      };

      const updated = await updateExchangeUser(userId, updates);

      expect(updated.id).toBe(userId);
      expect(updated.external_user_id).toBe(updates.external_user_id);
    });

    it('should update exchange_id', async () => {
      const userId = mockExchangeUsers[0].id;
      const updates = {
        exchange_id: mockExchanges[1].id, // Change to different exchange
      };

      const updated = await updateExchangeUser(userId, updates);

      expect(updated.id).toBe(userId);
      expect(updated.exchange_id).toBe(updates.exchange_id);
    });

    it('should update multiple fields', async () => {
      const userId = mockExchangeUsers[0].id;
      const updates = {
        name: 'multi_update_user',
        external_user_id: 'ext-multi-123',
      };

      const updated = await updateExchangeUser(userId, updates);

      expect(updated.id).toBe(userId);
      expect(updated.name).toBe(updates.name);
      expect(updated.external_user_id).toBe(updates.external_user_id);
    });

    it('should update the updated_at timestamp', async () => {
      const userId = mockExchangeUsers[0].id;
      const originalUpdatedAt = mockExchangeUsers[0].updated_at;

      // Wait a bit to ensure timestamp will be different
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await updateExchangeUser(userId, { name: 'New Name' });

      expect(updated.updated_at).not.toBe(originalUpdatedAt);
    });

    it('should throw NotFoundError for nonexistent user', async () => {
      const nonexistentId = 'nonexistent-user-id-12345';
      const updates = { name: 'New Name' };

      await expect(updateExchangeUser(nonexistentId, updates)).rejects.toThrow(NotFoundError);
    });

    it('should allow partial updates', async () => {
      const userId = mockExchangeUsers[0].id;
      const originalExchangeId = mockExchangeUsers[0].exchange_id;
      const originalExternalUserId = mockExchangeUsers[0].external_user_id;

      const updated = await updateExchangeUser(userId, {
        name: 'Only Name Updated',
      });

      expect(updated.exchange_id).toBe(originalExchangeId);
      expect(updated.external_user_id).toBe(originalExternalUserId);
      expect(updated.name).toBe('Only Name Updated');
    });
  });

  describe('deleteExchangeUser', () => {
    it('should delete exchange user successfully', async () => {
      const userId = mockExchangeUsers[0].id;

      await expect(deleteExchangeUser(userId)).resolves.toBeUndefined();
    });

    it('should remove user from list after deletion', async () => {
      const userId = mockExchangeUsers[0].id;

      await deleteExchangeUser(userId);

      // Try to get the deleted user
      await expect(getExchangeUser(userId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for nonexistent user', async () => {
      const nonexistentId = 'nonexistent-user-id-12345';

      await expect(deleteExchangeUser(nonexistentId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with proper message', async () => {
      try {
        await deleteExchangeUser('nonexistent-id');
        fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('ExchangeUser not found');
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in user names', async () => {
      const specialCharsData = {
        exchange_id: mockExchanges[0].id,
        external_user_id: 'ext-special-123',
        name: 'user_with-dashes.and.dots',
      };

      const created = await createExchangeUser(specialCharsData);

      expect(created.name).toBe(specialCharsData.name);
    });

    it('should handle very long names', async () => {
      const longName = 'u'.repeat(255); // Max length
      const userData = {
        exchange_id: mockExchanges[0].id,
        external_user_id: 'ext-long-name-123',
        name: longName,
      };

      const created = await createExchangeUser(userData);

      expect(created.name).toBe(longName);
    });

    it('should handle very long external_user_id', async () => {
      const longExternalId = 'e'.repeat(255); // Max length
      const userData = {
        exchange_id: mockExchanges[0].id,
        external_user_id: longExternalId,
        name: 'user_with_long_external_id',
      };

      const created = await createExchangeUser(userData);

      expect(created.external_user_id).toBe(longExternalId);
    });

    it('should handle user with minimal data', async () => {
      const minimalData = {
        exchange_id: mockExchanges[0].id,
        external_user_id: 'e',
        name: 'u',
      };

      const created = await createExchangeUser(minimalData);

      expect(created.name).toBe(minimalData.name);
      expect(created.external_user_id).toBe(minimalData.external_user_id);
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed ExchangeUser objects', async () => {
      const user: ExchangeUser = await getExchangeUser(mockExchangeUsers[0].id);

      // TypeScript should ensure these properties exist
      expect(typeof user.id).toBe('string');
      expect(typeof user.exchange_id).toBe('string');
      expect(typeof user.external_user_id).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.created_at).toBe('string');
      expect(typeof user.updated_at).toBe('string');
    });

    it('should accept properly typed create requests', async () => {
      const createRequest = {
        exchange_id: mockExchanges[0].id,
        external_user_id: 'typed-user-123',
        name: 'typed_user',
      };

      const created = await createExchangeUser(createRequest);
      expect(created).toBeDefined();
    });

    it('should accept properly typed update requests', async () => {
      const updateRequest = {
        name: 'Updated Name',
      };

      const updated = await updateExchangeUser(mockExchangeUsers[0].id, updateRequest);
      expect(updated).toBeDefined();
    });
  });

  describe('Relationships', () => {
    it('should preserve exchange_id relationship', async () => {
      const user = await getExchangeUser(mockExchangeUsers[0].id);

      // Verify the exchange_id is a valid UUID format
      expect(user.exchange_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('should allow multiple users for same exchange', async () => {
      const exchangeId = mockExchanges[0].id;

      const user1 = await createExchangeUser({
        exchange_id: exchangeId,
        external_user_id: 'ext-user-multi-1',
        name: 'multi_user_1',
      });

      const user2 = await createExchangeUser({
        exchange_id: exchangeId,
        external_user_id: 'ext-user-multi-2',
        name: 'multi_user_2',
      });

      expect(user1.exchange_id).toBe(exchangeId);
      expect(user2.exchange_id).toBe(exchangeId);
      expect(user1.id).not.toBe(user2.id);
    });
  });
});
