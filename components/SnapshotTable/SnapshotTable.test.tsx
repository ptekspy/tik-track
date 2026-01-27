import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SnapshotTable } from './SnapshotTable';
import { mockSnapshotTwentyFourHours, mockSnapshotSevenDay } from '@/lib/testing/mocks';

describe('SnapshotTable', () => {
  it('should render empty state when no snapshots provided', () => {
    render(<SnapshotTable snapshots={[]} />);

    expect(screen.getByText(/no snapshots recorded yet/i)).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    expect(screen.getByText(/^type$/i)).toBeInTheDocument();
    expect(screen.getByText(/^recorded$/i)).toBeInTheDocument();
    expect(screen.getByText(/^views$/i)).toBeInTheDocument();
    expect(screen.getByText(/^likes$/i)).toBeInTheDocument();
    expect(screen.getByText(/^comments$/i)).toBeInTheDocument();
    expect(screen.getByText(/^shares$/i)).toBeInTheDocument();
    expect(screen.getByText(/^followers$/i)).toBeInTheDocument();
    expect(screen.getByText(/^completion$/i)).toBeInTheDocument();
    expect(screen.getByText(/^engagement$/i)).toBeInTheDocument();
  });

  it('should render snapshot type label', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    expect(screen.getByText('1 Day')).toBeInTheDocument();
  });

  it('should render formatted date', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    // formatDate returns Jan 21, 2026
    expect(screen.getByText(/Jan 21, 2026/i)).toBeInTheDocument();
  });

  it('should render formatted numbers', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    // Check for formatted views (12,500)
    expect(screen.getByText('12,500')).toBeInTheDocument();
  });

  it('should render dash for null values', () => {
    const snapshotWithNulls = {
      ...mockSnapshotTwentyFourHours,
      likes: null,
      comments: null,
      shares: null,
    };

    render(<SnapshotTable snapshots={[snapshotWithNulls]} />);

    // Should have multiple dashes for null values
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('should calculate and display deltas between snapshots', () => {
    const snapshots = [mockSnapshotSevenDay, mockSnapshotTwentyFourHours];

    render(<SnapshotTable snapshots={snapshots} />);

    // Check for delta display (positive delta)
    // 7-day views (45000) - 1-day views (12500) = +32500
    expect(screen.getByText('+32,500')).toBeInTheDocument();
  });

  it('should sort snapshots by recordedAt descending', () => {
    const snapshots = [mockSnapshotTwentyFourHours, mockSnapshotSevenDay];

    render(<SnapshotTable snapshots={snapshots} />);

    const rows = screen.getAllByRole('row');
    // First row is header, second should be 7 Days (newest), third should be 1 Day
    expect(rows[1]).toHaveTextContent('7 Days');
    expect(rows[2]).toHaveTextContent('1 Day');
  });

  it('should display completion rate as percentage', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    // mockSnapshotTwentyFourHours has completionRate: Decimal(0.68) = 68%
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('should calculate and display engagement rate', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    // Engagement rate calculation:
    // views: 12500, likes: 1250, comments: 85, shares: 42
    // (1250 + 85 + 42) / 12500 * 100 = 11%
    expect(screen.getByText('11%')).toBeInTheDocument();
  });

  it('should display zero delta as dash', () => {
    const snapshot1 = { ...mockSnapshotTwentyFourHours, views: 1000 };
    const snapshot2 = { ...mockSnapshotTwentyFourHours, id: 'different-id', views: 1000 };

    render(<SnapshotTable snapshots={[snapshot2, snapshot1]} />);

    // Should show dash for zero delta
    const cells = screen.getAllByText('—');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should handle negative deltas', () => {
    const snapshot1 = { ...mockSnapshotTwentyFourHours, views: 1000, recordedAt: new Date('2026-01-20') };
    const snapshot2 = { ...mockSnapshotTwentyFourHours, id: 'different-id', views: 500, recordedAt: new Date('2026-01-21') };

    render(<SnapshotTable snapshots={[snapshot2, snapshot1]} />);

    // Delta should be -500
    expect(screen.getByText('-500')).toBeInTheDocument();
  });

  it('should not show delta for first (oldest) snapshot', () => {
    render(<SnapshotTable snapshots={[mockSnapshotTwentyFourHours]} />);

    // Should not have any delta text elements when only one snapshot
    const deltaElements = screen.queryAllByText(/^[+-]\d/);
    expect(deltaElements).toHaveLength(0);
  });
});
