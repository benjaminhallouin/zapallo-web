/**
 * Exchange detail page tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import ExchangeDetailPage from '@/app/exchanges/[id]/page';
import { mockExchanges } from '@/__tests__/mocks/data';
import { server } from '@/__tests__/mocks/server';
import { rest } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Mock useParams hook
jest.mock('next/navigation', () => ({
  useParams: () => ({
    id: mockExchanges[0].id,
  }),
}));

describe('ExchangeDetailPage', () => {
  it('shows loading state initially', () => {
    render(<ExchangeDetailPage />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders exchange details after loading', async () => {
    render(<ExchangeDetailPage />);

    await waitFor(() => {
      const cardMarketElements = screen.getAllByText('CardMarket');
      expect(cardMarketElements.length).toBeGreaterThan(0);
    });

    expect(screen.getByText('cardmarket')).toBeInTheDocument();
  });

  it('displays all exchange information', async () => {
    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Exchange Information')).toBeInTheDocument();
    });

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('Updated At')).toBeInTheDocument();
  });

  it('shows error state when exchange not found', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges/:id`, (_req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ detail: 'Exchange not found' }));
      })
    );

    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Exchange not found')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges/:id`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
      })
    );

    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
  });

  it('shows retry button on error', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges/:id`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
      })
    );

    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('retries fetching when retry button is clicked', async () => {
    let callCount = 0;

    server.use(
      rest.get(`${BASE_URL}/exchanges/:id`, (_req, res, ctx) => {
        callCount++;
        if (callCount === 1) {
          return res(ctx.status(500), ctx.json({ detail: 'Server error' }));
        }
        return res(ctx.json(mockExchanges[0]));
      })
    );

    render(<ExchangeDetailPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText('Retry');
    retryButton.click();

    // Wait for successful load
    await waitFor(() => {
      const cardMarketElements = screen.getAllByText('CardMarket');
      expect(cardMarketElements.length).toBeGreaterThan(0);
    });

    expect(screen.getByText('cardmarket')).toBeInTheDocument();
  });

  it('handles network errors gracefully', async () => {
    server.use(
      rest.get(`${BASE_URL}/exchanges/:id`, (_req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('renders back to exchanges link', async () => {
    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Back to exchanges')).toBeInTheDocument();
    });

    const backLink = screen.getByText('Back to exchanges').closest('a');
    expect(backLink).toHaveAttribute('href', '/exchanges');
  });

  it('renders action buttons when exchange is loaded', async () => {
    render(<ExchangeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
