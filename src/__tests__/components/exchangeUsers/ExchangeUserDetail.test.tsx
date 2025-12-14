/**
 * ExchangeUserDetail component tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExchangeUserDetail } from '@/components/exchangeUsers/ExchangeUserDetail';
import { mockExchangeUsers, mockExchanges } from '@/__tests__/mocks/data';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API methods
jest.mock('@/lib/api', () => ({
  deleteExchangeUser: jest.fn(),
}));

import { deleteExchangeUser } from '@/lib/api';

describe('ExchangeUserDetail', () => {
  const mockUser = mockExchangeUsers[0];
  const mockExchange = mockExchanges[0];
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders user information', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const johnSellerElements = screen.getAllByText('john_seller');
    expect(johnSellerElements.length).toBeGreaterThan(0);
  });

  it('displays all user fields', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Exchange')).toBeInTheDocument();
    expect(screen.getByText('Exchange ID')).toBeInTheDocument();
    expect(screen.getByText('External User ID')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('Updated At')).toBeInTheDocument();
  });

  it('displays exchange name as link when exchange is provided', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const exchangeLink = screen.getByText('CardMarket').closest('a');
    expect(exchangeLink).toHaveAttribute('href', `/exchanges/${mockExchange.id}`);
  });

  it('displays "Unknown Exchange" when exchange is not provided', () => {
    render(<ExchangeUserDetail user={mockUser} />);

    expect(screen.getByText('Unknown Exchange')).toBeInTheDocument();
  });

  it('displays IDs in monospace font', () => {
    const { container } = render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);
    const idElements = container.querySelectorAll('.font-mono');
    expect(idElements.length).toBeGreaterThan(0);
  });

  it('formats timestamps correctly', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    // Check that timestamps are displayed (format may vary based on locale)
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('renders back to exchange users link', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const backLink = screen.getByText('Back to exchange users').closest('a');
    expect(backLink).toHaveAttribute('href', '/exchange-users');
  });

  it('renders Edit button', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
  });

  it('renders Delete button', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
  });

  it('navigates to edit page when Edit button is clicked', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockRouter.push).toHaveBeenCalledWith(`/exchange-users/${mockUser.id}/edit`);
  });

  it('opens delete confirmation dialog when Delete button is clicked', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.getByText('Delete Exchange User')).toBeInTheDocument();
    expect(
      screen.getByText(`Are you sure you want to delete "${mockUser.name}"? This action cannot be undone.`)
    ).toBeInTheDocument();
  });

  it('cancels deletion when Cancel is clicked', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Dialog should be closed
    expect(screen.queryByText('Delete Exchange User')).not.toBeInTheDocument();
  });

  it('deletes user and redirects when deletion is confirmed', async () => {
    (deleteExchangeUser as jest.Mock).mockResolvedValue(undefined);

    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);

    // Confirm button is the second "Delete" button (in the dialog)
    const confirmButton = screen.getAllByRole('button', { name: 'Delete' })[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteExchangeUser).toHaveBeenCalledWith(mockUser.id);
    });

    // Should show success toast
    await waitFor(() => {
      expect(screen.getByText('Exchange user deleted successfully!')).toBeInTheDocument();
    });

    // Should redirect after delay
    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith('/exchange-users');
      },
      { timeout: 2000 }
    );
  });

  it('shows error toast when deletion fails', async () => {
    (deleteExchangeUser as jest.Mock).mockRejectedValue(new Error('Failed to delete'));

    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);

    // Confirm button is the second "Delete" button (in the dialog)
    const confirmButton = screen.getAllByRole('button', { name: 'Delete' })[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete')).toBeInTheDocument();
    });

    // Should not redirect
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('renders section heading', () => {
    render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    expect(screen.getByText('Exchange User Information')).toBeInTheDocument();
    expect(
      screen.getByText('Details about this user account on a trading platform')
    ).toBeInTheDocument();
  });

  it('uses proper semantic HTML structure', () => {
    const { container } = render(<ExchangeUserDetail user={mockUser} exchange={mockExchange} />);

    // Check for definition list
    expect(container.querySelector('dl')).toBeInTheDocument();

    // Check for definition terms and descriptions
    expect(container.querySelectorAll('dt').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('dd').length).toBeGreaterThan(0);
  });
});
