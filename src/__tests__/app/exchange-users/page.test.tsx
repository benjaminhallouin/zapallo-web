/**
 * Exchange Users list page tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import ExchangeUsersPage from '@/app/exchange-users/page';
import { mockExchangeUsers, mockExchanges } from '@/__tests__/mocks/data';
import { server } from '@/__tests__/mocks/server';
import { rest } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';
const API_BASE = `${BASE_URL}${API_PREFIX}`;

describe('ExchangeUsersPage', () => {
  it('shows loading state initially', () => {
    render(<ExchangeUsersPage />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders exchange users after loading', async () => {
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Exchange Users')).toBeInTheDocument();
    });

    expect(screen.getByText('john_seller')).toBeInTheDocument();
    expect(screen.getByText('jane_buyer')).toBeInTheDocument();
  });

  it('displays all exchange users from API', async () => {
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('john_seller')).toBeInTheDocument();
    });

    mockExchangeUsers.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument();
    });
  });

  it('displays exchange names for each user', async () => {
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('CardMarket')).toBeInTheDocument();
    });

    expect(screen.getByText('Play-in Games')).toBeInTheDocument();
  });

  it('fetches both users and exchanges in parallel', async () => {
    let usersRequested = false;
    let exchangesRequested = false;

    server.use(
      rest.get(`${API_BASE}/exchange_users`, (_req, res, ctx) => {
        usersRequested = true;
        return res(ctx.json(mockExchangeUsers));
      }),
      rest.get(`${API_BASE}/exchanges`, (_req, res, ctx) => {
        exchangesRequested = true;
        return res(ctx.json(mockExchanges));
      })
    );

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Exchange Users')).toBeInTheDocument();
    });

    expect(usersRequested).toBe(true);
    expect(exchangesRequested).toBe(true);
  });

  it('shows error state when users API fails', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
      })
    );

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
  });

  it('shows error state when exchanges API fails', async () => {
    server.use(
      rest.get(`${API_BASE}/exchanges`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Failed to load exchanges' }));
      })
    );

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to load exchanges/)).toBeInTheDocument();
  });

  it('shows retry button on error', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
      })
    );

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('retries fetching when retry button is clicked', async () => {
    let callCount = 0;

    server.use(
      rest.get(`${API_BASE}/exchange_users`, (_req, res, ctx) => {
        callCount++;
        if (callCount === 1) {
          return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
        }
        return res(ctx.json(mockExchangeUsers));
      })
    );

    render(<ExchangeUsersPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText('Retry');
    retryButton.click();

    // Wait for successful load
    await waitFor(() => {
      expect(screen.getByText('Exchange Users')).toBeInTheDocument();
    });

    expect(screen.getByText('john_seller')).toBeInTheDocument();
  });

  it('displays empty state when no users exist', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users`, (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('No exchange users found')).toBeInTheDocument();
    });
  });
});
