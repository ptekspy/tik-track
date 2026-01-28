import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoStatus } from '@/lib/generated/client/client';
import { VideoCard } from './VideoCard';
import { mockVideoPublished, mockSnapshotOneHour } from '@/lib/testing/mocks';

describe('VideoCard', () => {
  it('should render video title and description', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
    };

    render(<VideoCard video={video} />);

    expect(screen.getByText(video.title)).toBeInTheDocument();
    expect(screen.getByText(video.description)).toBeInTheDocument();
  });

  it('should display status badge', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
    };

    render(<VideoCard video={video} />);

    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('should display snapshot count', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [mockSnapshotOneHour, mockSnapshotOneHour],
    };

    render(<VideoCard video={video} />);

    expect(screen.getByText('2 snapshots')).toBeInTheDocument();
  });

  it('should display singular "snapshot" for count of 1', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [mockSnapshotOneHour],
    };

    render(<VideoCard video={video} />);

    expect(screen.getByText('1 snapshot')).toBeInTheDocument();
  });

  it('should display latest snapshot metrics', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [
        {
          ...mockSnapshotOneHour,
          views: 5000,
          likes: 250,
          comments: 50,
          shares: 25,
        },
      ],
    };

    render(<VideoCard video={video} />);

    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText(/6.5/)).toBeInTheDocument();
  });

  it('should show "No analytics data yet" for published videos without snapshots', () => {
    const video = {
      ...mockVideoPublished,
      status: VideoStatus.PUBLISHED,
      snapshots: [],
    };

    render(<VideoCard video={video} />);

    expect(screen.getByText(/no analytics data yet/i)).toBeInTheDocument();
  });

  it('should not show "No analytics data" message for draft videos', () => {
    const video = {
      ...mockVideoPublished,
      status: VideoStatus.DRAFT,
      snapshots: [],
    };

    render(<VideoCard video={video} />);

    expect(screen.queryByText(/no analytics data yet/i)).not.toBeInTheDocument();
  });

  it('should display signal badge for published videos with snapshots', () => {
    const video = {
      ...mockVideoPublished,
      status: VideoStatus.PUBLISHED,
      snapshots: [
        {
          ...mockSnapshotOneHour,
          views: 5000,
          likes: 250,
          comments: 50,
          shares: 25,
        },
      ],
    };

    render(<VideoCard video={video} />);

    // Should have 2 status elements: one for StatusBadge, one for SignalBadge
    const statusElements = screen.getAllByRole('status');
    expect(statusElements).toHaveLength(2);
  });

  it('should link to video detail page', () => {
    const video = {
      ...mockVideoPublished,
      id: 'test-video-id',
      snapshots: [],
    };

    render(<VideoCard video={video} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/videos/test-video-id');
  });

  it('should handle videos with multiple snapshots by showing latest', () => {
    const olderSnapshot = {
      ...mockSnapshotOneHour,
      recordedAt: new Date('2026-01-25T10:00:00Z'),
      views: 1000,
    };

    const newerSnapshot = {
      ...mockSnapshotOneHour,
      recordedAt: new Date('2026-01-26T10:00:00Z'),
      views: 5000,
    };

    const video = {
      ...mockVideoPublished,
      snapshots: [olderSnapshot, newerSnapshot],
    };

    render(<VideoCard video={video} />);

    // Should show the newer snapshot's views
    expect(screen.getByText('5,000')).toBeInTheDocument();
  });

  it('should truncate long titles with line-clamp', () => {
    const video = {
      ...mockVideoPublished,
      title: 'This is a very long title that should be truncated when it exceeds two lines of text in the card layout',
      snapshots: [],
    };

    const { container } = render(<VideoCard video={video} />);

    const titleElement = container.querySelector('h3');
    expect(titleElement).toHaveClass('line-clamp-2');
  });

  it('should truncate long descriptions with line-clamp', () => {
    const video = {
      ...mockVideoPublished,
      description: 'This is a very long description that should be truncated when it exceeds two lines of text in the card layout to maintain consistent card heights',
      snapshots: [],
    };

    const { container } = render(<VideoCard video={video} />);

    const descriptionElement = container.querySelector('p');
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });
});
