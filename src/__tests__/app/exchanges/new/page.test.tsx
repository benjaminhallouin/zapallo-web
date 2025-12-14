/**
 * New Exchange Page tests
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewExchangePage from '@/app/exchanges/new/page';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    createExchange: jest.fn(),
  },
}));

describe('NewExchangePage', () => {
  const mockPush = jest.fn();
  const mockCreateExchange = apiClient.createExchange as jest.MockedFunction<
    typeof apiClient.createExchange
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders create exchange form', () => {
    render(<NewExchangePage />);
    
    expect(screen.getByRole('heading', { name: 'Create New Exchange' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('has back to exchanges link', () => {
    render(<NewExchangePage />);
    
    const backLink = screen.getByRole('link', { name: /back to exchanges/i });
    expect(backLink).toHaveAttribute('href', '/exchanges');
  });

  it('creates exchange and redirects on successful submit', async () => {
    mockCreateExchange.mockResolvedValue({
      id: '123',
      name: 'cardmarket',
      display_name: 'CardMarket',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    });

    render(<NewExchangePage />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const submitButton = screen.getByRole('button', { name: 'Create' });

    await userEvent.type(nameInput, 'cardmarket');
    await userEvent.type(displayNameInput, 'CardMarket');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateExchange).toHaveBeenCalledWith({
        name: 'cardmarket',
        display_name: 'CardMarket',
      });
    });

    // Check for success toast
    await waitFor(() => {
      expect(screen.getByText('Exchange created successfully!')).toBeInTheDocument();
    });

    // Fast-forward time to trigger redirect
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/exchanges');
    });
  });

  it('displays error toast on failed submit', async () => {
    mockCreateExchange.mockRejectedValue(new Error('API Error'));

    render(<NewExchangePage />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const submitButton = screen.getByRole('button', { name: 'Create' });

    await userEvent.type(nameInput, 'cardmarket');
    await userEvent.type(displayNameInput, 'CardMarket');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays generic error message for non-Error exceptions', async () => {
    mockCreateExchange.mockRejectedValue('Unknown error');

    render(<NewExchangePage />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const submitButton = screen.getByRole('button', { name: 'Create' });

    await userEvent.type(nameInput, 'cardmarket');
    await userEvent.type(displayNameInput, 'CardMarket');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create exchange')).toBeInTheDocument();
    });
  });

  it('navigates back to list on cancel', () => {
    render(<NewExchangePage />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/exchanges');
  });
});
