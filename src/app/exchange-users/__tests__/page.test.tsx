/**
 * Tests for Exchange Users list page
 *
 * Tests filtering by exchange and sorting capabilities
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExchangeUsersPage from '../page';
import { getExchangeUsers, getExchanges } from '@/lib/api';

// Mock API calls
jest.mock('@/lib/api', () => ({
  getExchangeUsers: jest.fn(),
  getExchanges: jest.fn(),
}));

const mockGetExchangeUsers = getExchangeUsers as jest.MockedFunction<typeof getExchangeUsers>;
const mockGetExchanges = getExchanges as jest.MockedFunction<typeof getExchanges>;

describe('ExchangeUsersPage', () => {
  const mockExchanges = [
    { id: 'exchange-1', name: 'cardtrader', display_name: 'CardTrader', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 'exchange-2', name: 'playin', display_name: 'PlayIn', created_at: '2024-01-02', updated_at: '2024-01-02' },
  ];

  const mockUsers = [
    {
      id: 'user-1',
      exchange_id: 'exchange-1',
      external_user_id: 'ext-001',
      name: 'Alice',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'user-2',
      exchange_id: 'exchange-1',
      external_user_id: 'ext-002',
      name: 'Bob',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetExchanges.mockResolvedValue(mockExchanges);
    mockGetExchangeUsers.mockResolvedValue(mockUsers);
  });

  it('renders filter controls and loading state initially', async () => {
    mockGetExchanges.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<ExchangeUsersPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads exchanges and auto-selects first exchange', async () => {
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(mockGetExchanges).toHaveBeenCalled();
    });

    // Check that exchange dropdown is populated
    const exchangeSelect = screen.getByLabelText(/exchange/i);
    expect(exchangeSelect).toBeInTheDocument();
    
    // First exchange should be auto-selected
    await waitFor(() => {
      expect(mockGetExchangeUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          exchange_id: 'exchange-1',
        })
      );
    });
  });

  it('fetches users when exchange is selected', async () => {
    const user = userEvent.setup();
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(mockGetExchanges).toHaveBeenCalled();
    });

    // Change exchange
    const exchangeSelect = screen.getByLabelText(/exchange/i);
    await user.selectOptions(exchangeSelect, 'exchange-2');

    await waitFor(() => {
      expect(mockGetExchangeUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          exchange_id: 'exchange-2',
        })
      );
    });
  });

  it('applies sorting when sort options change', async () => {
    const user = userEvent.setup();
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(mockGetExchanges).toHaveBeenCalled();
    });

    // Wait for initial users fetch
    await waitFor(() => {
      expect(mockGetExchangeUsers).toHaveBeenCalled();
    });

    // Change sort field
    const sortBySelect = screen.getByLabelText(/sort by/i);
    await user.selectOptions(sortBySelect, 'name');

    await waitFor(() => {
      expect(mockGetExchangeUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          sort_by: 'name',
          sort_order: 'desc',
        })
      );
    });

    // Change sort order
    const sortOrderSelect = screen.getByLabelText(/sort order/i);
    await user.selectOptions(sortOrderSelect, 'asc');

    await waitFor(() => {
      expect(mockGetExchangeUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          sort_by: 'name',
          sort_order: 'asc',
        })
      );
    });
  });

  it('shows message when no exchange is selected', async () => {
    // Mock with no exchanges initially selected
    mockGetExchanges.mockResolvedValue([
      { id: 'exchange-1', name: 'test', display_name: 'Test', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ]);
    
    const user = userEvent.setup();
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(mockGetExchanges).toHaveBeenCalled();
    });

    // Deselect exchange
    const exchangeSelect = screen.getByLabelText(/exchange/i);
    await user.selectOptions(exchangeSelect, '');

    expect(screen.getByText(/please select an exchange to view users/i)).toBeInTheDocument();
  });

  it('disables sort controls when no exchange is selected', async () => {
    mockGetExchanges.mockResolvedValue([
      { id: 'exchange-1', name: 'test', display_name: 'Test', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ]);
    
    const user = userEvent.setup();
    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(mockGetExchanges).toHaveBeenCalled();
    });

    // Deselect exchange
    const exchangeSelect = screen.getByLabelText(/exchange/i);
    await user.selectOptions(exchangeSelect, '');

    // Sort controls should be disabled
    const sortBySelect = screen.getByLabelText(/sort by/i);
    const sortOrderSelect = screen.getByLabelText(/sort order/i);
    
    expect(sortBySelect).toBeDisabled();
    expect(sortOrderSelect).toBeDisabled();
  });

  it('handles API errors when loading exchanges', async () => {
    mockGetExchanges.mockRejectedValue(new Error('Failed to fetch'));

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load exchanges/i)).toBeInTheDocument();
    });
  });

  it('handles API errors when loading users', async () => {
    mockGetExchangeUsers.mockRejectedValue(new Error('Failed to fetch users'));

    render(<ExchangeUsersPage />);

    await waitFor(() => {
      expect(mockGetExchanges).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to load exchange users/i)).toBeInTheDocument();
    });
  });
});
