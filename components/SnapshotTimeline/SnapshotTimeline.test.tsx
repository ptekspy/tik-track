import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SnapshotTimeline } from './SnapshotTimeline';
import { mockVideoPublished, mockVideoDraft, mockSnapshotOneHour, mockSnapshotOneDay } from '@/lib/testing/mocks';
import { SnapshotType } from '@/lib/generated/client/client';

describe('SnapshotTimeline', () => {
  it('should show message for draft videos', () => {
    const video = {
      ...mockVideoDraft,
      snapshots: [],
    };

    render(<SnapshotTimeline video={video} />);

    expect(screen.getByText('No snapshots available for draft videos')).toBeInTheDocument();
  });

  it('should render all snapshot types', () => {
    const video = {
      ...mockVideoPublished,
      postDate: new Date('2026-01-27T10:00:00Z'), // Recent post
      snapshots: [],
    };

    render(<SnapshotTimeline video={video} />);

    expect(screen.getByText('1h')).toBeInTheDocument();
    expect(screen.getByText('3h')).toBeInTheDocument();
    expect(screen.getByText('6h')).toBeInTheDocument();
    expect(screen.getByText('12h')).toBeInTheDocument();
    expect(screen.getByText('1d')).toBeInTheDocument();
    expect(screen.getByText('2d')).toBeInTheDocument();
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('14d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
  });

  it('should mark completed snapshots with green styling', () => {
    const video = {
      ...mockVideoPublished,
      postDate: new Date('2026-01-26T10:00:00Z'), // Posted 1+ day ago
      snapshots: [
        { ...mockSnapshotOneHour, snapshotType: SnapshotType.ONE_HOUR },
        { ...mockSnapshotOneDay, snapshotType: SnapshotType.ONE_DAY },
      ],
    };

    render(<SnapshotTimeline video={video} />);

    // Find the 1h and 1d buttons
    const oneHourButton = screen.getByText('1h').closest('div');
    const oneDayButton = screen.getByText('1d').closest('div');

    expect(oneHourButton).toHaveClass('bg-green-100');
    expect(oneHourButton).toHaveClass('text-green-800');
    expect(oneDayButton).toHaveClass('bg-green-100');
    expect(oneDayButton).toHaveClass('text-green-800');
  });

  it('should mark missed snapshots with red styling', () => {
    // Post from 2 days ago, but only 1h snapshot exists (1d should be missed)
    const video = {
      ...mockVideoPublished,
      postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      snapshots: [
        { ...mockSnapshotOneHour, snapshotType: SnapshotType.ONE_HOUR },
      ],
    };

    render(<SnapshotTimeline video={video} />);

    // 3h, 6h, 12h, 1d should be missed (expected but not captured, beyond grace period)
    const oneDayButton = screen.getByText('1d').closest('div');
    expect(oneDayButton).toHaveClass('bg-red-100');
    expect(oneDayButton).toHaveClass('text-red-800');
  });

  it('should mark upcoming snapshots with gray styling', () => {
    // Post 1.5 hours ago: 1h is recently expected (upcoming), 3h+ not yet expected
    const postDate = new Date(Date.now() - 1.5 * 60 * 60 * 1000); // 1.5 hours ago
    
    const video = {
      ...mockVideoPublished,
      postDate,
      snapshots: [],
    };

    render(<SnapshotTimeline video={video} />);

    const oneHourButton = screen.getByText('1h').closest('div');
    expect(oneHourButton).toHaveClass('bg-gray-100');
    expect(oneHourButton).toHaveClass('text-gray-600');
  });

  it('should render legend', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
    };

    render(<SnapshotTimeline video={video} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Missed')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
    };

    const { container } = render(
      <SnapshotTimeline video={video} className="custom-class" />
    );

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should mark far-future snapshots as not applicable', () => {
    // Very recent post, 30d snapshot should not be expected yet
    const video = {
      ...mockVideoPublished,
      postDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      snapshots: [],
    };

    render(<SnapshotTimeline video={video} />);

    const thirtyDayButton = screen.getByText('30d').closest('div');
    expect(thirtyDayButton).toHaveClass('opacity-50');
  });
});
