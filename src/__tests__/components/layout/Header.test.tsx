import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders the application title', () => {
    render(<Header />);
    const title = screen.getByText('Zapallo Backoffice');
    expect(title).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Exchanges')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Cards')).toBeInTheDocument();
  });

  it('has correct href attributes on navigation links', () => {
    render(<Header />);
    const exchangesLink = screen.getByText('Exchanges').closest('a');
    const usersLink = screen.getByText('Users').closest('a');
    const cardsLink = screen.getByText('Cards').closest('a');

    expect(exchangesLink).toHaveAttribute('href', '/exchanges');
    expect(usersLink).toHaveAttribute('href', '/exchange-users');
    expect(cardsLink).toHaveAttribute('href', '/exchange-cards');
  });

  it('has correct styling classes', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-blue-600', 'text-white', 'shadow-md');
  });

  it('title links to home page', () => {
    render(<Header />);
    const titleLink = screen.getByText('Zapallo Backoffice').closest('a');
    expect(titleLink).toHaveAttribute('href', '/');
  });
});
