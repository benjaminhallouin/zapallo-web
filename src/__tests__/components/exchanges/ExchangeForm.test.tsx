/**
 * ExchangeForm component tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExchangeForm } from '@/components/exchanges/ExchangeForm';
import { Exchange } from '@/lib/types';

describe('ExchangeForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const mockExchange: Exchange = {
    id: '123',
    name: 'cardmarket',
    display_name: 'CardMarket',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('renders empty form for create mode', () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/display name/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders form with exchange data for edit mode', () => {
    render(
      <ExchangeForm
        exchange={mockExchange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('cardmarket');
    expect(screen.getByLabelText(/display name/i)).toHaveValue('CardMarket');
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('displays validation error for empty name', async () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for empty display name', async () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByPlaceholderText('e.g., cardmarket');
    await userEvent.type(nameInput, 'test');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Display name is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for name exceeding max length', async () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByPlaceholderText('e.g., cardmarket');
    const longName = 'a'.repeat(101);
    await userEvent.type(nameInput, longName);
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name must be 100 characters or less')
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for display name exceeding max length', async () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByPlaceholderText('e.g., cardmarket');
    const displayNameInput = screen.getByPlaceholderText('e.g., CardMarket');
    
    await userEvent.type(nameInput, 'test');
    const longName = 'a'.repeat(256);
    await userEvent.type(displayNameInput, longName);
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Display name must be 255 characters or less')
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByPlaceholderText('e.g., cardmarket');
    const displayNameInput = screen.getByPlaceholderText('e.g., CardMarket');
    
    await userEvent.type(nameInput, 'cardmarket');
    await userEvent.type(displayNameInput, 'CardMarket');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'cardmarket',
        display_name: 'CardMarket',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    const slowSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ExchangeForm onSubmit={slowSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByPlaceholderText('e.g., cardmarket');
    const displayNameInput = screen.getByPlaceholderText('e.g., CardMarket');
    
    await userEvent.type(nameInput, 'test');
    await userEvent.type(displayNameInput, 'Test');
    
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Saving...');
    });
  });

  it('shows required indicators on fields', () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const labels = screen.getAllByText('*');
    expect(labels).toHaveLength(2); // Both fields should have required indicators
  });

  it('has placeholder text on inputs', () => {
    render(<ExchangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByPlaceholderText('e.g., cardmarket')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., CardMarket')).toBeInTheDocument();
  });
});
