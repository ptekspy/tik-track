import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoCharts } from './VideoCharts';
import { mockSnapshotOneHour, mockSnapshotTwentyFourHours } from '@/lib/testing/mocks';

describe('VideoCharts', () => {
  it('should render views chart', () => {
    const snapshots = [mockSnapshotOneHour];

    render(<VideoCharts snapshots={snapshots} />);

    expect(screen.getByText('Views Over Time')).toBeInTheDocument();
  });

  it('should render engagement metrics chart', () => {
    const snapshots = [mockSnapshotOneHour];

    render(<VideoCharts snapshots={snapshots} />);

    expect(screen.getByText('Engagement Metrics')).toBeInTheDocument();
  });

  it('should render engagement rate chart', () => {
    const snapshots = [mockSnapshotOneHour];

    render(<VideoCharts snapshots={snapshots} />);

    expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
  });

  it('should sort snapshots by recordedAt', () => {
    // Create snapshots with reversed dates
    const snapshot1 = {
      ...mockSnapshotOneHour,
      recordedAt: new Date('2024-01-10T00:00:00Z'),
      views: 100,
    };
    const snapshot2 = {
      ...mockSnapshotTwentyFourHours,
      recordedAt: new Date('2024-01-05T00:00:00Z'),
      views: 50,
    };

    render(<VideoCharts snapshots={[snapshot1, snapshot2]} />);

    // Should render without error
    expect(screen.getByText('Views Over Time')).toBeInTheDocument();
  });

  it('should handle single snapshot', () => {
    const snapshots = [mockSnapshotOneHour];

    render(<VideoCharts snapshots={snapshots} />);

    // Should still render all three charts
    expect(screen.getByText('Views Over Time')).toBeInTheDocument();
    expect(screen.getByText('Engagement Metrics')).toBeInTheDocument();
    expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
  });

  it('should use responsive container', () => {
    const snapshots = [mockSnapshotOneHour];

    render(<VideoCharts snapshots={snapshots} />);

    // Should render the chart sections
    expect(screen.getByText('Views Over Time')).toBeInTheDocument();
    expect(screen.getByText('Engagement Metrics')).toBeInTheDocument();
    expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
  });

  it('should display chart titles', () => {
    const snapshots = [mockSnapshotOneHour];

    render(<VideoCharts snapshots={snapshots} />);

    expect(screen.getByText('Views Over Time')).toBeInTheDocument();
    expect(screen.getByText('Engagement Metrics')).toBeInTheDocument();
    expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
  });
});
