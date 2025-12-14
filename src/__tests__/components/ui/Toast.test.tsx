/**
 * Toast component tests
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { Toast } from '@/components/ui/Toast';

jest.useFakeTimers();

describe('Toast', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders toast message', () => {
    const onClose = jest.fn();
    render(<Toast message="Test message" onClose={onClose} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders success variant', () => {
    const onClose = jest.fn();
    render(<Toast message="Success" type="success" onClose={onClose} />);
    const toast = screen.getByRole('alert');
    expect(toast.firstChild).toHaveClass('bg-green-50');
  });

  it('renders error variant', () => {
    const onClose = jest.fn();
    render(<Toast message="Error" type="error" onClose={onClose} />);
    const toast = screen.getByRole('alert');
    expect(toast.firstChild).toHaveClass('bg-red-50');
  });

  it('renders info variant by default', () => {
    const onClose = jest.fn();
    render(<Toast message="Info" onClose={onClose} />);
    const toast = screen.getByRole('alert');
    expect(toast.firstChild).toHaveClass('bg-blue-50');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: 'Close' });
    act(() => {
      closeButton.click();
    });

    act(() => {
      jest.advanceTimersByTime(300); // Wait for fade out animation
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after duration', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" duration={2000} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(2000); // Duration
    });

    act(() => {
      jest.advanceTimersByTime(300); // Fade out animation
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses default duration of 3000ms', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has accessible alert role', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" onClose={onClose} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });
});
