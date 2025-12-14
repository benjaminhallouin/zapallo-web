/**
 * MSW Server Setup
 *
 * Configures Mock Service Worker server for Node.js test environment.
 * Used to intercept and mock HTTP requests during tests.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server instance
 *
 * Intercepts HTTP requests in Node.js test environment
 * and responds with mocked data from handlers.
 */
export const server = setupServer(...handlers);
