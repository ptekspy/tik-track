import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import { VideoStatus } from '@/lib/generated/client/client';

describe('StatusBadge', () => {
  it('should render DRAFT status with gray styling', () => {
    render(<StatusBadge status={VideoStatus.DRAFT} />);

    const badge = screen.getByText(/Draft/);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-amber-100');
  });

  it('should render PUBLISHED status with green styling', () => {
    render(<StatusBadge status={VideoStatus.PUBLISHED} />);

    const badge = screen.getByText(/Published/);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-emerald-100');
  });

  it('should render ARCHIVED status with blue styling', () => {
    render(<StatusBadge status={VideoStatus.ARCHIVED} />);

    const badge = screen.getByText(/Archived/);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-slate-100');
  });

  it('should have role="status" for accessibility', () => {
    render(<StatusBadge status={VideoStatus.DRAFT} />);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('should have appropriate aria-label', () => {
    render(<StatusBadge status={VideoStatus.PUBLISHED} />);

    const badge = screen.getByLabelText('Status: Published');
    expect(badge).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<StatusBadge status={VideoStatus.DRAFT} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should render with rounded-full styling', () => {
    render(<StatusBadge status={VideoStatus.DRAFT} />);

    const badge = screen.getByText('Draft');
    expect(badge).toHaveClass('rounded-full');
  });
});
