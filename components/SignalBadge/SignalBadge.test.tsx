import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SignalBadge } from './SignalBadge';

describe('SignalBadge', () => {
  it('should render positive signal with green styling', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByText('Positive Signal');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
    expect(badge).toHaveClass('border-green-200');
  });

  it('should render negative signal with red styling', () => {
    render(<SignalBadge signal="negative" />);

    const badge = screen.getByText('Negative Signal');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
    expect(badge).toHaveClass('border-red-200');
  });

  it('should render neutral signal with gray styling', () => {
    render(<SignalBadge signal="neutral" />);

    const badge = screen.getByText('Neutral');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
    expect(badge).toHaveClass('border-gray-200');
  });

  it('should have role="status" for accessibility', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('should have appropriate aria-label', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByLabelText('Positive Signal');
    expect(badge).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<SignalBadge signal="neutral" className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should render with rounded-full styling', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByText('Positive Signal');
    expect(badge).toHaveClass('rounded-full');
  });
});
