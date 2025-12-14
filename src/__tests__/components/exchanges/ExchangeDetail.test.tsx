/**
 * ExchangeDetail component tests
 */

import { render, screen } from '@testing-library/react';
import { ExchangeDetail } from '@/components/exchanges/ExchangeDetail';
import { mockExchanges } from '@/__tests__/mocks/data';

describe('ExchangeDetail', () => {
  const mockExchange = mockExchanges[0];

  it('renders exchange information', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    const cardMarketElements = screen.getAllByText('CardMarket');
    expect(cardMarketElements.length).toBeGreaterThan(0);
    expect(screen.getByText('cardmarket')).toBeInTheDocument();
  });

  it('displays all exchange fields', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('Updated At')).toBeInTheDocument();
  });

  it('displays ID in monospace font', () => {
    const { container } = render(<ExchangeDetail exchange={mockExchange} />);
    const idElement = screen.getByText(mockExchange.id);
    expect(idElement).toHaveClass('font-mono');
  });

  it('formats timestamps correctly', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    // Check that timestamps are displayed (format may vary based on locale)
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('renders back to exchanges link', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    const backLink = screen.getByText('Back to exchanges').closest('a');
    expect(backLink).toHaveAttribute('href', '/exchanges');
  });

  it('renders Edit button (disabled)', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeDisabled();
  });

  it('renders Delete button (disabled)', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });

  it('has title for disabled Edit button', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toHaveAttribute('title', 'Edit functionality coming soon');
  });

  it('has title for disabled Delete button', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toHaveAttribute('title', 'Delete functionality coming soon');
  });

  it('renders section heading', () => {
    render(<ExchangeDetail exchange={mockExchange} />);

    expect(screen.getByText('Exchange Information')).toBeInTheDocument();
    expect(screen.getByText('Details about this trading platform')).toBeInTheDocument();
  });

  it('uses proper semantic HTML structure', () => {
    const { container } = render(<ExchangeDetail exchange={mockExchange} />);

    // Check for definition list
    expect(container.querySelector('dl')).toBeInTheDocument();

    // Check for definition terms and descriptions
    expect(container.querySelectorAll('dt').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('dd').length).toBeGreaterThan(0);
  });
});
