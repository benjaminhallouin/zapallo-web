/**
 * New ExchangeUser Page tests
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewExchangeUserPage from '@/app/exchange-users/new/page';
import * as api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Exchange, ExchangeUser } from '@/lib/types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  getExchanges: jest.fn(),
  createExchangeUser: jest.fn(),
}));

describe('NewExchangeUserPage', () => {
  const mockPush = jest.fn();
  const mockGetExchanges = api.getExchanges as jest.MockedFunction<typeof api.getExchanges>;
  const mockCreateExchangeUser = api.createExchangeUser as jest.MockedFunction<
    typeof api.createExchangeUser
  >;

  const mockExchanges: Exchange[] = [
    {
      id: 'exchange-1',
      name: 'cardmarket',
      display_name: 'CardMarket',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockGetExchanges.mockResolvedValue(mockExchanges);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders create exchange user form', async () => {
    render(<NewExchangeUserPage />);
    
    expect(screen.getByRole('heading', { name: 'Create New Exchange User' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/external user id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('has back to exchange users link', () => {
    render(<NewExchangeUserPage />);
    
    const backLink = screen.getByRole('link', { name: /back to exchange users/i });
    expect(backLink).toHaveAttribute('href', '/exchange-users');
  });

  it('creates exchange user and redirects to detail page on successful submit', async () => {
    const newUser: ExchangeUser = {
      id: 'user-123',
      exchange_id: 'exchange-1',
      external_user_id: 'ext_12345',
      name: 'john_doe',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };
    mockCreateExchangeUser.mockResolvedValue(newUser);

    render(<NewExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    const externalUserIdInput = screen.getByLabelText(/external user id/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: 'Create' });

    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    await userEvent.type(externalUserIdInput, 'ext_12345');
    await userEvent.type(nameInput, 'john_doe');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateExchangeUser).toHaveBeenCalledWith({
        exchange_id: 'exchange-1',
        external_user_id: 'ext_12345',
        name: 'john_doe',
      });
    });

    // Check for success toast
    await waitFor(() => {
      expect(screen.getByText('Exchange user created successfully!')).toBeInTheDocument();
    });

    // Fast-forward time to trigger redirect
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/exchange-users/user-123');
    });
  });

  it('displays error toast on failed submit', async () => {
    mockCreateExchangeUser.mockRejectedValue(new Error('API Error'));

    render(<NewExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    const externalUserIdInput = screen.getByLabelText(/external user id/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: 'Create' });

    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    await userEvent.type(externalUserIdInput, 'ext_12345');
    await userEvent.type(nameInput, 'john_doe');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays generic error message for non-Error exceptions', async () => {
    mockCreateExchangeUser.mockRejectedValue('Unknown error');

    render(<NewExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    const externalUserIdInput = screen.getByLabelText(/external user id/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: 'Create' });

    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    await userEvent.type(externalUserIdInput, 'ext_12345');
    await userEvent.type(nameInput, 'john_doe');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create exchange user')).toBeInTheDocument();
    });
  });

  it('navigates back to list on cancel', async () => {
    render(<NewExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/exchange-users');
  });
});
