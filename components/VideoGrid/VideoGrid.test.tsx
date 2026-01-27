import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoGrid } from './VideoGrid';
import { mockVideoPublished, mockSnapshotOneHour } from '@/lib/testing/mocks';

describe('VideoGrid', () => {
  it('should render video cards in a grid', () => {
    const videos = [
      {
        ...mockVideoPublished,
        id: 'video-1',
        title: 'Video 1',
        snapshots: [],
      },
      {
        ...mockVideoPublished,
        id: 'video-2',
        title: 'Video 2',
        snapshots: [],
      },
      {
        ...mockVideoPublished,
        id: 'video-3',
        title: 'Video 3',
        snapshots: [],
      },
    ];

    render(<VideoGrid videos={videos} />);

    expect(screen.getByText('Video 1')).toBeInTheDocument();
    expect(screen.getByText('Video 2')).toBeInTheDocument();
    expect(screen.getByText('Video 3')).toBeInTheDocument();
  });

  it('should display empty message when no videos', () => {
    render(<VideoGrid videos={[]} />);

    expect(screen.getByText('No videos found')).toBeInTheDocument();
  });

  it('should display custom empty message', () => {
    render(<VideoGrid videos={[]} emptyMessage="Create your first video!" />);

    expect(screen.getByText('Create your first video!')).toBeInTheDocument();
  });

  it('should use responsive grid layout', () => {
    const videos = [
      {
        ...mockVideoPublished,
        id: 'video-1',
        snapshots: [],
      },
    ];

    const { container } = render(<VideoGrid videos={videos} />);

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('md:grid-cols-2');
    expect(gridElement).toHaveClass('lg:grid-cols-3');
  });

  it('should render each video with VideoCard component', () => {
    const videos = [
      {
        ...mockVideoPublished,
        id: 'video-1',
        title: 'Test Video',
        snapshots: [mockSnapshotOneHour],
      },
    ];

    render(<VideoGrid videos={videos} />);

    // VideoCard renders a link
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/videos/video-1');
  });
});
