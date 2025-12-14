/**
 * Edit ExchangeUser Page tests
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditExchangeUserPage from '@/app/exchange-users/[id]/edit/page';
import * as api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { Exchange, ExchangeUser } from '@/lib/types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  getExchanges: jest.fn(),
  getExchangeUser: jest.fn(),
  updateExchangeUser: jest.fn(),
}));

describe('EditExchangeUserPage', () => {
  const mockPush = jest.fn();
  const mockGetExchanges = api.getExchanges as jest.MockedFunction<typeof api.getExchanges>;
  const mockGetExchangeUser = api.getExchangeUser as jest.MockedFunction<
    typeof api.getExchangeUser
  >;
  const mockUpdateExchangeUser = api.updateExchangeUser as jest.MockedFunction<
    typeof api.updateExchangeUser
  >;

  const mockExchanges: Exchange[] = [
    {
      id: 'exchange-1',
      name: 'cardmarket',
      display_name: 'CardMarket',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'exchange-2',
      name: 'tcgplayer',
      display_name: 'TCGPlayer',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockUser: ExchangeUser = {
    id: 'user-123',
    exchange_id: 'exchange-1',
    external_user_id: 'ext_12345',
    name: 'john_doe',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useParams as jest.Mock).mockReturnValue({
      id: 'user-123',
    });
    mockGetExchanges.mockResolvedValue(mockExchanges);
    mockGetExchangeUser.mockResolvedValue(mockUser);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows loading state while fetching user data', () => {
    mockGetExchangeUser.mockImplementation(() => new Promise(() => {}));
    render(<EditExchangeUserPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders edit form with user data after loading', async () => {
    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange User' })).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toHaveValue('exchange-1');
      expect(screen.getByLabelText(/external user id/i)).toHaveValue('ext_12345');
      expect(screen.getByLabelText(/name/i)).toHaveValue('john_doe');
    });

    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('has back to user details link', async () => {
    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange User' })).toBeInTheDocument();
    });

    const backLink = screen.getByRole('link', { name: /back to user details/i });
    expect(backLink).toHaveAttribute('href', '/exchange-users/user-123');
  });

  it('displays error message when user fetch fails', async () => {
    mockGetExchangeUser.mockRejectedValue(new Error('Failed to load user'));
    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load user')).toBeInTheDocument();
    });
  });

  it('displays error message when user is not found', async () => {
    mockGetExchangeUser.mockResolvedValue(null as any);
    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Exchange user not found')).toBeInTheDocument();
    });
  });

  it('updates exchange user and redirects to detail page on successful submit', async () => {
    const updatedUser: ExchangeUser = {
      ...mockUser,
      name: 'john_doe_updated',
    };
    mockUpdateExchangeUser.mockResolvedValue(updatedUser);

    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('john_doe');
    });

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: 'Update' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'john_doe_updated');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateExchangeUser).toHaveBeenCalledWith('user-123', {
        exchange_id: 'exchange-1',
        external_user_id: 'ext_12345',
        name: 'john_doe_updated',
      });
    });

    // Check for success toast
    await waitFor(() => {
      expect(screen.getByText('Exchange user updated successfully!')).toBeInTheDocument();
    });

    // Fast-forward time to trigger redirect
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/exchange-users/user-123');
    });
  });

  it('displays error toast on failed update', async () => {
    mockUpdateExchangeUser.mockRejectedValue(new Error('API Error'));

    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('john_doe');
    });

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: 'Update' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'john_doe_updated');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays generic error message for non-Error exceptions', async () => {
    mockUpdateExchangeUser.mockRejectedValue('Unknown error');

    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('john_doe');
    });

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: 'Update' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'john_doe_updated');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update exchange user')).toBeInTheDocument();
    });
  });

  it('navigates back to detail page on cancel', async () => {
    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Exchange User' })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/exchange-users/user-123');
  });

  it('fetches user data using the id from params', async () => {
    render(<EditExchangeUserPage />);
    
    await waitFor(() => {
      expect(mockGetExchangeUser).toHaveBeenCalledWith('user-123');
    });
  });
});
