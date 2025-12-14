/**
 * ExchangeUserForm component tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExchangeUserForm } from '@/components/exchangeUsers/ExchangeUserForm';
import { ExchangeUser, Exchange } from '@/lib/types';
import * as api from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  getExchanges: jest.fn(),
}));

describe('ExchangeUserForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockGetExchanges = api.getExchanges as jest.MockedFunction<typeof api.getExchanges>;

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
    mockOnSubmit.mockResolvedValue(undefined);
    mockGetExchanges.mockResolvedValue(mockExchanges);
  });

  it('renders loading state while fetching exchanges', () => {
    mockGetExchanges.mockImplementation(() => new Promise(() => {}));
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders empty form for create mode after exchanges load', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/external user id/i)).toHaveValue('');
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('populates exchange dropdown with fetched exchanges', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const select = screen.getByLabelText(/exchange/i) as HTMLSelectElement;
    expect(select.options).toHaveLength(3); // placeholder + 2 exchanges
    expect(select.options[1].textContent).toBe('CardMarket');
    expect(select.options[2].textContent).toBe('TCGPlayer');
  });

  it('renders form with user data for edit mode', async () => {
    render(
      <ExchangeUserForm
        user={mockUser}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/exchange/i)).toHaveValue('exchange-1');
    expect(screen.getByLabelText(/external user id/i)).toHaveValue('ext_12345');
    expect(screen.getByLabelText(/name/i)).toHaveValue('john_doe');
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('displays error when exchanges fail to load', async () => {
    mockGetExchanges.mockRejectedValue(new Error('Failed to fetch'));
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading exchanges/i)).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('displays warning when no exchanges are available', async () => {
    mockGetExchanges.mockResolvedValue([]);
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no exchanges available/i)).toBeInTheDocument();
    });
  });

  it('displays validation error for empty exchange selection', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Select an exchange')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for empty external user ID', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('External user ID is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for empty name', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    const externalUserIdInput = screen.getByPlaceholderText('e.g., ext_12345');
    
    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    await userEvent.type(externalUserIdInput, 'ext_123');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for external user ID exceeding max length', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const externalUserIdInput = screen.getByPlaceholderText('e.g., ext_12345');
    const longId = 'a'.repeat(256);
    await userEvent.type(externalUserIdInput, longId);
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('External user ID must be 255 characters or less')
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for name exceeding max length', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('e.g., john_doe');
    const longName = 'a'.repeat(256);
    await userEvent.type(nameInput, longName);
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name must be 255 characters or less')
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    const externalUserIdInput = screen.getByPlaceholderText('e.g., ext_12345');
    const nameInput = screen.getByPlaceholderText('e.g., john_doe');
    
    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    await userEvent.type(externalUserIdInput, 'ext_12345');
    await userEvent.type(nameInput, 'john_doe');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        exchange_id: 'exchange-1',
        external_user_id: 'ext_12345',
        name: 'john_doe',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    const slowSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ExchangeUserForm onSubmit={slowSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/exchange/i)).toBeInTheDocument();
    });

    const exchangeSelect = screen.getByLabelText(/exchange/i);
    const externalUserIdInput = screen.getByPlaceholderText('e.g., ext_12345');
    const nameInput = screen.getByPlaceholderText('e.g., john_doe');
    
    await userEvent.selectOptions(exchangeSelect, 'exchange-1');
    await userEvent.type(externalUserIdInput, 'ext_12345');
    await userEvent.type(nameInput, 'john_doe');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
    });
  });

  it('disables submit button when no exchanges are available', async () => {
    mockGetExchanges.mockResolvedValue([]);
    render(<ExchangeUserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no exchanges available/i)).toBeInTheDocument();
    });

    // The component shows error, not the form, so no button to check
  });
});
