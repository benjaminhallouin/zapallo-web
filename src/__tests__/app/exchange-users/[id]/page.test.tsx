/**
 * Exchange User detail page tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import ExchangeUserDetailPage from '@/app/exchange-users/[id]/page';
import { mockExchangeUsers, mockExchanges } from '@/__tests__/mocks/data';
import { server } from '@/__tests__/mocks/server';
import { rest } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';
const API_BASE = `${BASE_URL}${API_PREFIX}`;

// Mock useParams hook
jest.mock('next/navigation', () => ({
  useParams: () => ({
    id: mockExchangeUsers[0].id,
  }),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('ExchangeUserDetailPage', () => {
  it('shows loading state initially', () => {
    render(<ExchangeUserDetailPage />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders exchange user details after loading', async () => {
    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      const johnSellerElements = screen.getAllByText('john_seller');
      expect(johnSellerElements.length).toBeGreaterThan(0);
    });
  });

  it('displays all exchange user information', async () => {
    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Exchange User Information')).toBeInTheDocument();
    });

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Exchange')).toBeInTheDocument();
    expect(screen.getByText('Exchange ID')).toBeInTheDocument();
    expect(screen.getByText('External User ID')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('Updated At')).toBeInTheDocument();
  });

  it('fetches and displays associated exchange', async () => {
    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('CardMarket')).toBeInTheDocument();
    });
  });

  it('handles missing exchange gracefully', async () => {
    server.use(
      rest.get(`${API_BASE}/exchanges/:id`, (_req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ detail: 'Exchange not found' }));
      })
    );

    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Unknown Exchange')).toBeInTheDocument();
    });
  });

  it('shows error state when exchange user not found', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users/:id`, (_req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ detail: 'Exchange user not found' }));
      })
    );

    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Exchange user not found')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users/:id`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
      })
    );

    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
  });

  it('shows retry button on error', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users/:id`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
      })
    );

    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('retries fetching when retry button is clicked', async () => {
    let callCount = 0;

    server.use(
      rest.get(`${API_BASE}/exchange_users/:id`, (_req, res, ctx) => {
        callCount++;
        if (callCount === 1) {
          return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
        }
        return res(ctx.json(mockExchangeUsers[0]));
      })
    );

    render(<ExchangeUserDetailPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText('Retry');
    retryButton.click();

    // Wait for successful load
    await waitFor(() => {
      const johnSellerElements = screen.getAllByText('john_seller');
      expect(johnSellerElements.length).toBeGreaterThan(0);
    });
  });

  it('handles network errors gracefully', async () => {
    server.use(
      rest.get(`${API_BASE}/exchange_users/:id`, (_req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('renders back to exchange users link', async () => {
    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Back to exchange users')).toBeInTheDocument();
    });

    const backLink = screen.getByText('Back to exchange users').closest('a');
    expect(backLink).toHaveAttribute('href', '/exchange-users');
  });

  it('renders Edit button', async () => {
    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  it('renders Delete button', async () => {
    render(<ExchangeUserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });
});
