import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    // Default mock implementation
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Exchanges')).toBeInTheDocument();
    expect(screen.getByText('Exchange Users')).toBeInTheDocument();
    expect(screen.getByText('Exchange Cards')).toBeInTheDocument();
  });

  it('renders icons for each link', () => {
    render(<Sidebar />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('🏪')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('🃏')).toBeInTheDocument();
  });

  it('has correct href attributes', () => {
    render(<Sidebar />);
    const homeLink = screen.getByText('Home').closest('a');
    const exchangesLink = screen.getByText('Exchanges').closest('a');
    const usersLink = screen.getByText('Exchange Users').closest('a');
    const cardsLink = screen.getByText('Exchange Cards').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(exchangesLink).toHaveAttribute('href', '/exchanges');
    expect(usersLink).toHaveAttribute('href', '/exchange-users');
    expect(cardsLink).toHaveAttribute('href', '/exchange-cards');
  });

  it('highlights the active link (home)', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Sidebar />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('bg-blue-600', 'text-white', 'font-semibold');
  });

  it('highlights the active link (exchanges)', () => {
    (usePathname as jest.Mock).mockReturnValue('/exchanges');
    render(<Sidebar />);
    const exchangesLink = screen.getByText('Exchanges').closest('a');
    expect(exchangesLink).toHaveClass('bg-blue-600', 'text-white', 'font-semibold');
  });

  it('highlights the active link (exchange users)', () => {
    (usePathname as jest.Mock).mockReturnValue('/exchange-users');
    render(<Sidebar />);
    const usersLink = screen.getByText('Exchange Users').closest('a');
    expect(usersLink).toHaveClass('bg-blue-600', 'text-white', 'font-semibold');
  });

  it('does not highlight inactive links', () => {
    (usePathname as jest.Mock).mockReturnValue('/exchanges');
    render(<Sidebar />);
    const homeLink = screen.getByText('Home').closest('a');
    const usersLink = screen.getByText('Exchange Users').closest('a');

    expect(homeLink).not.toHaveClass('bg-blue-600');
    expect(usersLink).not.toHaveClass('bg-blue-600');
  });

  it('has correct styling for sidebar', () => {
    const { container } = render(<Sidebar />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('w-64', 'bg-gray-100', 'min-h-screen', 'p-4');
  });
});
