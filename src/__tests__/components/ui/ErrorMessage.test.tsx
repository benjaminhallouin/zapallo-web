/**
 * ErrorMessage component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('has error role for accessibility', () => {
    render(<ErrorMessage message="Error" />);
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toBeInTheDocument();
  });

  it('displays error title', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has correct styling for error state', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    const errorBox = container.querySelector('.bg-red-50');
    expect(errorBox).toBeInTheDocument();
  });
});
