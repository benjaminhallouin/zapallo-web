/**
 * ExchangeList component tests
 */

import { render, screen } from '@testing-library/react';
import { ExchangeList } from '@/components/exchanges/ExchangeList';
import { mockExchanges } from '@/__tests__/mocks/data';

describe('ExchangeList', () => {
  it('renders exchanges in a table', () => {
    render(<ExchangeList exchanges={mockExchanges} />);

    expect(screen.getByText('Exchanges')).toBeInTheDocument();
    expect(screen.getByText('cardmarket')).toBeInTheDocument();
    expect(screen.getByText('CardMarket')).toBeInTheDocument();
    expect(screen.getByText('playin')).toBeInTheDocument();
    expect(screen.getByText('Play-in Games')).toBeInTheDocument();
  });

  it('displays table headers', () => {
    render(<ExchangeList exchanges={mockExchanges} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('formats created_at dates correctly', () => {
    render(<ExchangeList exchanges={mockExchanges} />);

    // Check that dates are displayed (format may vary based on locale)
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('renders view links for each exchange', () => {
    render(<ExchangeList exchanges={mockExchanges} />);

    const viewLinks = screen.getAllByText('View');
    // Should have at least as many view links as exchanges
    expect(viewLinks.length).toBeGreaterThanOrEqual(mockExchanges.length);

    // Check first visible link has correct href
    const firstViewLink = viewLinks.find((link) => link.closest('a'))?.closest('a');
    expect(firstViewLink).toHaveAttribute('href', `/exchanges/${mockExchanges[0].id}`);
  });

  it('renders create button', () => {
    render(<ExchangeList exchanges={mockExchanges} />);

    const createButtons = screen.getAllByText('Create Exchange');
    expect(createButtons.length).toBeGreaterThan(0);

    const createLink = createButtons[0].closest('a');
    expect(createLink).toHaveAttribute('href', '/exchanges/new');
  });

  it('displays empty state when no exchanges', () => {
    render(<ExchangeList exchanges={[]} />);

    expect(screen.getByText('No exchanges found')).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating your first exchange.')
    ).toBeInTheDocument();
  });

  it('renders create button in empty state', () => {
    render(<ExchangeList exchanges={[]} />);

    const createButton = screen.getByText('Create Exchange');
    expect(createButton).toBeInTheDocument();

    const createLink = createButton.closest('a');
    expect(createLink).toHaveAttribute('href', '/exchanges/new');
  });

  it('has description text', () => {
    render(<ExchangeList exchanges={mockExchanges} />);

    expect(
      screen.getByText(/A list of all trading platforms where cards can be bought and sold/)
    ).toBeInTheDocument();
  });

  it('applies hover styles to table rows', () => {
    const { container } = render(<ExchangeList exchanges={mockExchanges} />);

    const rows = container.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      expect(row).toHaveClass('hover:bg-gray-50');
    });
  });
});
