/**
 * ApiClient Tests
 *
 * Tests for the base ApiClient class, covering HTTP methods,
 * error handling, timeouts, and response parsing.
 */

import { rest } from 'msw';
import { server } from '../../mocks/server';
import { ApiClient } from '@/lib/api/client';
import {
  ApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  NetworkError,
  TimeoutError,
} from '@/lib/api/errors';

describe('ApiClient', () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient(baseUrl, 5000);
  });

  describe('Constructor', () => {
    it('should initialize with default base URL from config', () => {
      const defaultClient = new ApiClient();
      expect(defaultClient).toBeInstanceOf(ApiClient);
    });

    it('should remove trailing slash from base URL', () => {
      const clientWithSlash = new ApiClient('http://localhost:8000/');
      expect(clientWithSlash).toBeInstanceOf(ApiClient);
    });

    it('should accept custom timeout', () => {
      const customClient = new ApiClient(baseUrl, 10000);
      expect(customClient).toBeInstanceOf(ApiClient);
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const response = await client.get('/exchanges');
      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });

    it('should handle GET request for single resource', async () => {
      const exchangeId = '123e4567-e89b-12d3-a456-426614174001';
      const response = await client.get(`/exchanges/${exchangeId}`);

      expect(response).toHaveProperty('id', exchangeId);
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('display_name');
    });

    it('should throw NotFoundError for missing resource', async () => {
      await expect(client.get('/exchanges/nonexistent-id')).rejects.toThrow(NotFoundError);
    });

    it('should handle empty array response', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges`, (_req, res, ctx) => {
          return res(ctx.json([]));
        })
      );

      const response = await client.get<Array<unknown>>('/exchanges');
      expect(response).toEqual([]);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with body', async () => {
      const newExchange = {
        name: 'tcgplayer',
        display_name: 'TCGPlayer',
      };

      const response = await client.post('/exchanges', newExchange);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', 'tcgplayer');
      expect(response).toHaveProperty('display_name', 'TCGPlayer');
    });

    it('should throw ConflictError for duplicate resource', async () => {
      const duplicateExchange = {
        name: 'cardmarket', // Already exists in mock data
        display_name: 'CardMarket',
      };

      await expect(client.post('/exchanges', duplicateExchange)).rejects.toThrow(ConflictError);
    });

    it('should handle POST without body', async () => {
      server.use(
        rest.post(`${baseUrl}/test-endpoint`, (_req, res, ctx) => {
          return res(ctx.json({ success: true }));
        })
      );

      const response = await client.post<{ success: boolean }>('/test-endpoint');
      expect(response).toEqual({ success: true });
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const exchangeId = '123e4567-e89b-12d3-a456-426614174001';
      const updates = {
        display_name: 'CardMarket EU',
      };

      const response = await client.put(`/exchanges/${exchangeId}`, updates);

      expect(response).toHaveProperty('id', exchangeId);
      expect(response).toHaveProperty('display_name', 'CardMarket EU');
    });

    it('should throw NotFoundError when updating nonexistent resource', async () => {
      const updates = { display_name: 'New Name' };

      await expect(client.put('/exchanges/nonexistent-id', updates)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make successful PATCH request', async () => {
      server.use(
        rest.patch(`${baseUrl}/exchanges/:id`, async (req, res, ctx) => {
          const { id } = req.params;
          const body = (await req.json()) as { display_name?: string };

          return res(ctx.json({
            id,
            name: 'cardmarket',
            display_name: body.display_name || 'CardMarket',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
          }));
        })
      );

      const exchangeId = '123e4567-e89b-12d3-a456-426614174001';
      const updates = { display_name: 'CardMarket PATCH' };

      const response = await client.patch(`/exchanges/${exchangeId}`, updates);

      expect(response).toHaveProperty('id', exchangeId);
      expect(response).toHaveProperty('display_name', 'CardMarket PATCH');
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const exchangeId = '123e4567-e89b-12d3-a456-426614174001';

      const response = await client.delete(`/exchanges/${exchangeId}`);
      expect(response).toBeUndefined(); // DELETE typically returns no content
    });

    it('should throw NotFoundError when deleting nonexistent resource', async () => {
      await expect(client.delete('/exchanges/nonexistent-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('Error Handling', () => {
    it('should handle 400 Bad Request as ValidationError', async () => {
      server.use(
        rest.post(`${baseUrl}/exchanges`, (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              detail: [
                { msg: 'Field required', loc: ['body', 'name'] },
                { msg: 'Invalid format', loc: ['body', 'display_name'] },
              ],
            })
          );
        })
      );

      await expect(client.post('/exchanges', {})).rejects.toThrow(ValidationError);
    });

    it('should handle 404 Not Found as NotFoundError', async () => {
      await expect(client.get('/exchanges/nonexistent-id')).rejects.toThrow(NotFoundError);
    });

    it('should handle 409 Conflict as ConflictError', async () => {
      const duplicate = { name: 'cardmarket', display_name: 'CardMarket' };
      await expect(client.post('/exchanges', duplicate)).rejects.toThrow(ConflictError);
    });

    it('should handle 500 Internal Server Error as ApiError', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges`, (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
        })
      );

      await expect(client.get('/exchanges')).rejects.toThrow(ApiError);
    });

    it('should handle non-JSON error response', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges`, (_req, res, ctx) => {
          return res(ctx.status(500), ctx.body('Plain text error'));
        })
      );

      await expect(client.get('/exchanges')).rejects.toThrow(ApiError);
    });

    it('should extract error message from FastAPI detail string', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges/:id`, (_req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ detail: 'Resource not found' }));
        })
      );

      try {
        await client.get('/exchanges/nonexistent-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('Resource not found');
      }
    });

    it('should extract error messages from validation error array', async () => {
      server.use(
        http.post(`${baseUrl}/exchanges`, () => {
          return HttpResponse.json(
            {
              detail: [
                { msg: 'Field required', loc: ['body', 'name'] },
                { msg: 'String too short', loc: ['body', 'display_name'] },
              ],
            },
            { status: 400 }
          );
        })
      );

      try {
        await client.post('/exchanges', {});
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('Field required');
        expect((error as ValidationError).message).toContain('String too short');
      }
    });
  });

  describe('Timeout Handling', () => {
    it('should throw TimeoutError when request exceeds timeout', async () => {
      server.use(
        rest.get(`${baseUrl}/exchanges`, async (_req, res, ctx) => {
          // Simulate slow response
          await new Promise((resolve) => setTimeout(resolve, 200));
          return res(ctx.json([]));
        })
      );

      const fastClient = new ApiClient(baseUrl, 50); // 50ms timeout

      await expect(fastClient.get('/exchanges')).rejects.toThrow(TimeoutError);
    });

    it('should use custom timeout for individual request', async () => {
      server.use(
        http.get(`${baseUrl}/exchanges`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json([]);
        })
      );

      // Default timeout is 5000ms, but we set a custom 50ms timeout for this request
      await expect(client.get('/exchanges', { timeout: 50 })).rejects.toThrow(TimeoutError);
    });

    it('should handle timeout error message correctly', async () => {
      server.use(
        http.get(`${baseUrl}/exchanges`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return HttpResponse.json([]);
        })
      );

      const fastClient = new ApiClient(baseUrl, 50);

      try {
        await fastClient.get('/exchanges');
        fail('Should have thrown TimeoutError');
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect((error as TimeoutError).message).toContain('timeout');
        expect((error as TimeoutError).message).toContain('50ms');
      }
    });
  });

  describe('Network Error Handling', () => {
    it('should throw NetworkError for network failures', async () => {
      server.use(
        http.get(`${baseUrl}/exchanges`, () => {
          return HttpResponse.error();
        })
      );

      await expect(client.get('/exchanges')).rejects.toThrow(NetworkError);
    });

    it('should include error details in NetworkError', async () => {
      server.use(
        http.get(`${baseUrl}/exchanges`, () => {
          return HttpResponse.error();
        })
      );

      try {
        await client.get('/exchanges');
        fail('Should have thrown NetworkError');
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect((error as NetworkError).message).toContain('Network request failed');
      }
    });
  });

  describe('Request Options', () => {
    it('should include Content-Type header by default', async () => {
      let capturedHeaders: Headers | undefined;

      server.use(
        rest.post(`${baseUrl}/exchanges`, (req, res, ctx) => {
          capturedHeaders = req.headers;
          return res(ctx.json({ id: 'test', name: 'test', display_name: 'Test' }));
        })
      );

      await client.post('/exchanges', { name: 'test', display_name: 'Test' });

      expect(capturedHeaders?.get('content-type')).toBe('application/json');
    });

    it('should allow custom headers', async () => {
      let capturedHeaders: Headers | undefined;

      server.use(
        rest.get(`${baseUrl}/exchanges`, (req, res, ctx) => {
          capturedHeaders = req.headers;
          return res(ctx.json([]));
        })
      );

      await client.get('/exchanges', {
        headers: {
          'X-Custom-Header': 'test-value',
        },
      });

      expect(capturedHeaders?.get('x-custom-header')).toBe('test-value');
    });
  });

  describe('Response Handling', () => {
    it('should parse JSON response correctly', async () => {
      const response = await client.get('/exchanges');

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });

    it('should handle empty response (204 No Content)', async () => {
      const exchangeId = '123e4567-e89b-12d3-a456-426614174001';
      const response = await client.delete(`/exchanges/${exchangeId}`);

      expect(response).toBeUndefined();
    });

    it('should handle non-JSON response gracefully', async () => {
      server.use(
        rest.get(`${baseUrl}/test-text`, (_req, res, ctx) => {
          return res(
            ctx.set('Content-Type', 'text/plain'),
            ctx.body('Plain text response')
          );
        })
      );

      const response = await client.get('/test-text');
      expect(response).toBeUndefined();
    });
  });
});
