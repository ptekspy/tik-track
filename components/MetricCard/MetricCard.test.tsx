import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';
import { Eye } from 'lucide-react';

describe('MetricCard', () => {
  it('should render label and value', () => {
    render(<MetricCard label="Total Views" value="10,000" />);

    expect(screen.getByText('Total Views')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should format numeric value with commas', () => {
    render(<MetricCard label="Followers" value={1234567} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('should render string value as-is', () => {
    render(<MetricCard label="Status" value="Active" />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should not render delta when undefined', () => {
    const { container } = render(<MetricCard label="Metric" value="100" />);

    const trendingIcons = container.querySelectorAll('svg');
    expect(trendingIcons.length).toBe(0);
  });

  it('should not render delta when zero', () => {
    const { container } = render(<MetricCard label="Metric" value="100" delta={0} />);

    expect(screen.queryByText('+0.0%')).not.toBeInTheDocument();
    expect(screen.queryByText('0.0%')).not.toBeInTheDocument();
  });

  it('should render positive delta with green color and up arrow', () => {
    render(<MetricCard label="Engagement" value="5%" delta={12.5} />);

    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toHaveClass('text-green-600');
  });

  it('should render negative delta with red color and down arrow', () => {
    render(<MetricCard label="Completion Rate" value="45%" delta={-8.3} />);

    expect(screen.getByText('-8.3%')).toBeInTheDocument();
    expect(screen.getByText('-8.3%')).toHaveClass('text-red-600');
  });

  it('should render icon when provided', () => {
    const { container } = render(
      <MetricCard label="Views" value="1000" icon={Eye} />
    );

    // Check if icon is rendered (Eye icon will be an svg)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should not render icon when not provided', () => {
    const { container } = render(<MetricCard label="Metric" value="100" />);

    // No icon should be rendered
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MetricCard label="Test" value="123" className="custom-class" />
    );

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should render with icon and positive delta', () => {
    const { container } = render(
      <MetricCard label="Views" value={5000} delta={25.5} icon={Eye} />
    );

    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('+25.5%')).toBeInTheDocument();
    
    // Should have both Eye icon and TrendingUp icon
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(2);
  });
});
