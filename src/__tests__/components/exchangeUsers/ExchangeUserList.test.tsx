/**
 * ExchangeUserList component tests
 */

import { render, screen } from '@testing-library/react';
import { ExchangeUserList } from '@/components/exchangeUsers/ExchangeUserList';
import { mockExchangeUsers, mockExchanges } from '@/__tests__/mocks/data';

describe('ExchangeUserList', () => {
  it('renders exchange users in a table', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    expect(screen.getByText('Exchange Users')).toBeInTheDocument();
    expect(screen.getByText('john_seller')).toBeInTheDocument();
    expect(screen.getByText('jane_buyer')).toBeInTheDocument();
  });

  it('displays table headers', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Exchange')).toBeInTheDocument();
    expect(screen.getByText('External ID')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('displays exchange names from exchange data', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    expect(screen.getByText('CardMarket')).toBeInTheDocument();
    expect(screen.getByText('Play-in Games')).toBeInTheDocument();
  });

  it('displays external user IDs', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    expect(screen.getByText('ext-user-123')).toBeInTheDocument();
    expect(screen.getByText('ext-user-456')).toBeInTheDocument();
  });

  it('formats created_at dates correctly', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    // Check that dates are displayed (format may vary based on locale)
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('renders view links for each user', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    const viewLinks = screen.getAllByText('View');
    // Should have at least as many view links as users
    expect(viewLinks.length).toBeGreaterThanOrEqual(mockExchangeUsers.length);

    // Check first visible link has correct href
    const firstViewLink = viewLinks.find((link) => link.closest('a'))?.closest('a');
    expect(firstViewLink).toHaveAttribute('href', `/exchange-users/${mockExchangeUsers[0].id}`);
  });

  it('handles missing exchange gracefully', () => {
    const usersWithUnknownExchange = [
      {
        ...mockExchangeUsers[0],
        exchange_id: 'unknown-exchange-id',
      },
    ];

    render(<ExchangeUserList users={usersWithUnknownExchange} exchanges={mockExchanges} />);

    expect(screen.getByText('Unknown Exchange')).toBeInTheDocument();
  });

  it('renders create button', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    const createButtons = screen.getAllByText('Create Exchange User');
    expect(createButtons.length).toBeGreaterThan(0);

    const createLink = createButtons[0].closest('a');
    expect(createLink).toHaveAttribute('href', '/exchange-users/new');
  });

  it('displays empty state when no users', () => {
    render(<ExchangeUserList users={[]} exchanges={mockExchanges} />);

    expect(screen.getByText('No exchange users found')).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating your first exchange user.')
    ).toBeInTheDocument();
  });

  it('renders create button in empty state', () => {
    render(<ExchangeUserList users={[]} exchanges={mockExchanges} />);

    const createButton = screen.getByText('Create Exchange User');
    expect(createButton).toBeInTheDocument();

    const createLink = createButton.closest('a');
    expect(createLink).toHaveAttribute('href', '/exchange-users/new');
  });

  it('has description text', () => {
    render(<ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />);

    expect(
      screen.getByText(
        /A list of all user accounts on trading platforms where cards can be bought and sold/
      )
    ).toBeInTheDocument();
  });

  it('applies hover styles to table rows', () => {
    const { container } = render(
      <ExchangeUserList users={mockExchangeUsers} exchanges={mockExchanges} />
    );

    const rows = container.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      expect(row).toHaveClass('hover:bg-gray-50');
    });
  });
});
