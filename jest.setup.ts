// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Setup MSW (Mock Service Worker) for API mocking in tests
import { server } from './src/__tests__/mocks/server';
import { resetMockData } from './src/__tests__/mocks/handlers';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
  });
});

// Reset handlers and mock data after each test to ensure test isolation
afterEach(() => {
  server.resetHandlers();
  resetMockData();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
