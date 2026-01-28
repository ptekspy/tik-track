import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SignalBadge } from './SignalBadge';

describe('SignalBadge', () => {
  it('should render positive signal with green styling', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByText(/Positive/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-emerald-500');
  });

  it('should render negative signal with red styling', () => {
    render(<SignalBadge signal="negative" />);

    const badge = screen.getByText(/Negative/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-red-500');
  });

  it('should render neutral signal with gray styling', () => {
    render(<SignalBadge signal="neutral" />);

    const badge = screen.getByText(/Neutral/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-slate-400');
  });

  it('should have role="status" for accessibility', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('should have appropriate aria-label', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByLabelText(/Positive/i);
    expect(badge).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<SignalBadge signal="neutral" className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should render with rounded-full styling', () => {
    render(<SignalBadge signal="positive" />);

    const badge = screen.getByText(/Positive/i);
    expect(badge).toHaveClass('rounded-full');
  });
});
