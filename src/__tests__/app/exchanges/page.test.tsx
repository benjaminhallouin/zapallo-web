/**
 * Exchanges list page tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import ExchangesPage from '@/app/exchanges/page';
import { mockExchanges } from '@/__tests__/mocks/data';
import { server } from '@/__tests__/mocks/server';
import { rest } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

describe('ExchangesPage', () => {
  it('shows loading state initially', () => {
    render(<ExchangesPage />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders exchanges after loading', async () => {
    render(<ExchangesPage />);

    await waitFor(() => {
      expect(screen.getByText('Exchanges')).toBeInTheDocument();
    });

    expect(screen.getByText('cardmarket')).toBeInTheDocument();
    expect(screen.getByText('CardMarket')).toBeInTheDocument();
  });

  it('displays all exchanges from API', async () => {
    render(<ExchangesPage />);

    await waitFor(() => {
      expect(screen.getByText('cardmarket')).toBeInTheDocument();
    });

    mockExchanges.forEach((exchange) => {
      expect(screen.getByText(exchange.name)).toBeInTheDocument();
      expect(screen.getByText(exchange.display_name)).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
      })
    );

    render(<ExchangesPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
  });

  it('shows retry button on error', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
      })
    );

    render(<ExchangesPage />);

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('retries fetching when retry button is clicked', async () => {
    let callCount = 0;

    server.use(
      rest.get(`${BASE_URL}/exchanges`, (_req, res, ctx) => {
        callCount++;
        if (callCount === 1) {
          return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
        }
        return res(ctx.json(mockExchanges));
      })
    );

    render(<ExchangesPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText('Retry');
    retryButton.click();

    // Wait for successful load
    await waitFor(() => {
      expect(screen.getByText('Exchanges')).toBeInTheDocument();
    });

    expect(screen.getByText('cardmarket')).toBeInTheDocument();
  });

  it('shows empty state when no exchanges exist', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges`, (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<ExchangesPage />);

    await waitFor(() => {
      expect(screen.getByText('No exchanges found')).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges`, (_req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<ExchangesPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
