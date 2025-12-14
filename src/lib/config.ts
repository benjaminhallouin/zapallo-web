/**
 * Application configuration module
 *
 * Manages environment variables and provides type-safe access to configuration values.
 * Validates required environment variables on application startup.
 */

const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;

/**
 * Validates that all required environment variables are present
 *
 * @throws {Error} If any required environment variables are missing
 */
export function validateConfig(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Application configuration object
 *
 * Frozen to prevent mutations and ensure configuration consistency
 */
export const config = Object.freeze({
  /** Base URL for the Zapallo API */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  /** API request timeout in milliseconds */
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
});

/**
 * Type definition for the configuration object
 */
export type Config = typeof config;
