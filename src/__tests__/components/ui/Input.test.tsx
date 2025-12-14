/**
 * Input component tests
 */

import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input id="test-input" label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Input id="test-input" label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input id="test-input" label="Test" error="This field is required" />);
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('applies error styling when error is present', () => {
    render(<Input id="test-input" label="Test" error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not show error styling when no error', () => {
    render(<Input id="test-input" label="Test" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveClass('border-red-300');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Input id="test-input" label="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Input id="test-input" label="Test" className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards other input props', () => {
    render(
      <Input
        id="test-input"
        label="Test"
        placeholder="Enter text"
        type="email"
        maxLength={50}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('links label to input with htmlFor', () => {
    render(<Input id="unique-id" label="Linked Label" />);
    const label = screen.getByText('Linked Label');
    expect(label).toHaveAttribute('for', 'unique-id');
  });

  it('associates error message with input', () => {
    render(<Input id="test-input" label="Test" error="Error text" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    expect(screen.getByText('Error text')).toHaveAttribute('id', 'test-input-error');
  });
});
