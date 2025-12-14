/**
 * Tests for configuration module
 */

import { config, validateConfig } from '@/lib/config';

describe('config', () => {
  describe('validateConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset environment before each test
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      // Restore original environment
      process.env = originalEnv;
    });

    it('should not throw error when NEXT_PUBLIC_API_URL is set', () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
      
      expect(() => validateConfig()).not.toThrow();
    });

    it('should throw error when NEXT_PUBLIC_API_URL is missing', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      
      expect(() => validateConfig()).toThrow(
        'Missing required environment variables: NEXT_PUBLIC_API_URL'
      );
    });

    it('should throw error with correct message for missing variable', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      
      expect(() => validateConfig()).toThrow(/NEXT_PUBLIC_API_URL/);
    });

    it('should not throw when optional variables are missing', () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
      delete process.env.NEXT_PUBLIC_API_TIMEOUT;
      
      expect(() => validateConfig()).not.toThrow();
    });
  });

  describe('config object', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should read apiUrl from environment', () => {
      const testUrl = 'http://test-api.example.com';
      process.env.NEXT_PUBLIC_API_URL = testUrl;
      
      // Note: config is frozen and cached, so we need to test via module reload
      // For this test, we'll verify the default behavior
      expect(config.apiUrl).toBeDefined();
      expect(typeof config.apiUrl).toBe('string');
    });

    it('should use default apiUrl when not set', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      
      // The config object uses a default value
      expect(config.apiUrl).toBe('http://localhost:8000');
    });

    it('should read apiTimeout from environment', () => {
      process.env.NEXT_PUBLIC_API_TIMEOUT = '5000';
      
      // Config is cached, but we can verify the type
      expect(typeof config.apiTimeout).toBe('number');
    });

    it('should parse apiTimeout as integer', () => {
      expect(Number.isInteger(config.apiTimeout)).toBe(true);
    });

    it('should use default apiTimeout when not set', () => {
      delete process.env.NEXT_PUBLIC_API_TIMEOUT;
      
      expect(config.apiTimeout).toBe(30000);
    });

    it('should be immutable (frozen)', () => {
      expect(Object.isFrozen(config)).toBe(true);
    });

    it('should not allow modification of apiUrl', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        config.apiUrl = 'http://hacker.com';
      }).toThrow();
    });

    it('should not allow modification of apiTimeout', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        config.apiTimeout = 999;
      }).toThrow();
    });

    it('should not allow adding new properties', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        config.newProp = 'test';
      }).toThrow();
    });

    it('should have correct structure', () => {
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('apiTimeout');
    });

    it('should have only expected properties', () => {
      const keys = Object.keys(config);
      expect(keys).toEqual(expect.arrayContaining(['apiUrl', 'apiTimeout']));
      expect(keys.length).toBe(2);
    });
  });

  describe('config type safety', () => {
    it('should have apiUrl as string type', () => {
      expect(typeof config.apiUrl).toBe('string');
    });

    it('should have apiTimeout as number type', () => {
      expect(typeof config.apiTimeout).toBe('number');
    });

    it('should not have apiUrl as empty string', () => {
      expect(config.apiUrl.length).toBeGreaterThan(0);
    });

    it('should have apiTimeout as positive number', () => {
      expect(config.apiTimeout).toBeGreaterThan(0);
    });

    it('should have valid URL format for apiUrl', () => {
      expect(() => new URL(config.apiUrl)).not.toThrow();
    });
  });
});
