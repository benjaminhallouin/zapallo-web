/**
 * Edit Exchange Page tests
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditExchangePage from '@/app/exchanges/[id]/edit/page';
import { apiClient } from '@/lib/api/client';
import { useRouter, useParams } from 'next/navigation';
import { Exchange } from '@/lib/types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    getExchange: jest.fn(),
    updateExchange: jest.fn(),
  },
}));

describe('EditExchangePage', () => {
  const mockPush = jest.fn();
  const mockGetExchange = apiClient.getExchange as jest.MockedFunction<
    typeof apiClient.getExchange
  >;
  const mockUpdateExchange = apiClient.updateExchange as jest.MockedFunction<
    typeof apiClient.updateExchange
  >;

  const mockExchange: Exchange = {
    id: '123',
    name: 'cardmarket',
    display_name: 'CardMarket',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useParams as jest.Mock).mockReturnValue({
      id: '123',
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows loading state while fetching exchange', () => {
    mockGetExchange.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<EditExchangePage />);
    
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    mockGetExchange.mockRejectedValue(new Error('Failed to load'));

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });
  });

  it('renders edit form with exchange data', async () => {
    mockGetExchange.mockResolvedValue(mockExchange);

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange' })).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('e.g., cardmarket')).toHaveValue('cardmarket');
    expect(screen.getByPlaceholderText('e.g., CardMarket')).toHaveValue('CardMarket');
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('has back to detail link', async () => {
    mockGetExchange.mockResolvedValue(mockExchange);

    render(<EditExchangePage />);

    await waitFor(() => {
      const backLink = screen.getByRole('link', { name: /back to exchange details/i });
      expect(backLink).toHaveAttribute('href', '/exchanges/123');
    });
  });

  it('updates exchange and redirects on successful submit', async () => {
    mockGetExchange.mockResolvedValue(mockExchange);
    mockUpdateExchange.mockResolvedValue({
      ...mockExchange,
      display_name: 'Updated Name',
    });

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange' })).toBeInTheDocument();
    });

    const displayNameInput = screen.getByPlaceholderText('e.g., CardMarket');
    await userEvent.clear(displayNameInput);
    await userEvent.type(displayNameInput, 'Updated Name');

    const submitButton = screen.getByRole('button', { name: 'Update' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateExchange).toHaveBeenCalledWith('123', {
        name: 'cardmarket',
        display_name: 'Updated Name',
      });
    });

    // Check for success toast
    await waitFor(() => {
      expect(screen.getByText('Exchange updated successfully!')).toBeInTheDocument();
    });

    // Fast-forward time to trigger redirect
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/exchanges/123');
    });
  });

  it('displays error toast on failed update', async () => {
    mockGetExchange.mockResolvedValue(mockExchange);
    mockUpdateExchange.mockRejectedValue(new Error('Update failed'));

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange' })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'Update' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays generic error message for non-Error exceptions', async () => {
    mockGetExchange.mockResolvedValue(mockExchange);
    mockUpdateExchange.mockRejectedValue('Unknown error');

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange' })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'Update' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update exchange')).toBeInTheDocument();
    });
  });

  it('navigates back to detail on cancel', async () => {
    mockGetExchange.mockResolvedValue(mockExchange);

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/exchanges/123');
  });

  it('shows retry button on error', async () => {
    mockGetExchange.mockRejectedValue(new Error('Load error'));

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('displays not found message when exchange is null', async () => {
    mockGetExchange.mockResolvedValue(null as any);

    render(<EditExchangePage />);

    await waitFor(() => {
      expect(screen.getByText('Exchange not found')).toBeInTheDocument();
    });
  });
});
