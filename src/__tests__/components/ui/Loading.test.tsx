/**
 * Loading component tests
 */

import { render, screen } from '@testing-library/react';
import { Loading } from '@/components/ui/Loading';

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
  });

  it('has correct aria-label for accessibility', () => {
    render(<Loading />);
    const loadingElement = screen.getByLabelText('Loading');
    expect(loadingElement).toBeInTheDocument();
  });

  it('has spinner animation class', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('centers content on screen', () => {
    const { container } = render(<Loading />);
    const wrapper = container.querySelector('.min-h-screen');
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
