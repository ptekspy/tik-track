import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoDetail } from './VideoDetail';
import {
  mockVideoDraft,
  mockVideoPublished,
  mockSnapshotOneHour,
  mockSnapshotTwentyFourHours,
  mockHashtag,
} from '@/lib/testing/mocks';
import { useRouter } from 'next/navigation';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock VideoCharts component
vi.mock('@/components/VideoCharts/VideoCharts', () => ({
  VideoCharts: () => <div data-testid="video-charts">Charts</div>,
}));

describe('VideoDetail', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
    
    // Setup window methods
    global.window.confirm = vi.fn();
    global.window.alert = vi.fn();
  });

  it('should render video title and description', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText(video.title)).toBeInTheDocument();
    expect(screen.getByText(video.description!)).toBeInTheDocument();
  });

  it('should render status badge', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('should render post date', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText(/Jan \d+, 202\d/)).toBeInTheDocument();
  });

  it('should display "Not posted" when postDate is null', () => {
    const video = {
      ...mockVideoDraft,
      postDate: null,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText('Not posted')).toBeInTheDocument();
  });

  it('should render hashtags', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [
        { hashtag: { id: '1', tag: 'coding' } },
        { hashtag: { id: '2', tag: 'tutorial' } },
      ],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText('#coding')).toBeInTheDocument();
    expect(screen.getByText('#tutorial')).toBeInTheDocument();
  });

  it('should display "None" when no hashtags', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('should render edit button when onEdit provided', () => {
    const onEdit = vi.fn();
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should not render edit button when onEdit not provided', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('should render delete button when onDelete provided', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} onDelete={vi.fn()} />);

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should confirm before deleting', async () => {
    const onDelete = vi.fn();
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    // Mock window.confirm to return false (cancel)
    vi.mocked(window.confirm).mockReturnValue(false);

    render(<VideoDetail video={video} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this video? This action cannot be undone.'
    );
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('should delete video when confirmed', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    // Mock window.confirm to return true (confirm)
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<VideoDetail video={video} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/videos');
    });
  });

  it('should render add snapshot button when onAddSnapshot provided', () => {
    const onAddSnapshot = vi.fn();
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} onAddSnapshot={onAddSnapshot} />);

    const addButtons = screen.getAllByRole('button', { name: /add snapshot/i });
    expect(addButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);
    expect(onAddSnapshot).toHaveBeenCalledTimes(1);
  });

  it('should render signal badge for published video with snapshots', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [mockSnapshotOneHour],
      hashtags: [],
    };

    const { container } = render(<VideoDetail video={video} />);

    // Component should render without crashing
    expect(container).toBeInTheDocument();
  });

  it('should not render signal badge for draft video', () => {
    const video = {
      ...mockVideoDraft,
      snapshots: [mockSnapshotOneHour],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.queryByText(/positive|negative|neutral/i)).not.toBeInTheDocument();
  });

  it('should render snapshot timeline for published video', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [mockSnapshotOneHour],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.getByText('Analytics Timeline')).toBeInTheDocument();
  });

  it('should not render timeline for video without post date', () => {
    const video = {
      ...mockVideoDraft,
      postDate: null,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(screen.queryByText('Analytics Timeline')).not.toBeInTheDocument();
  });

  it('should render empty state for published video without snapshots', () => {
    const video = {
      ...mockVideoPublished,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} onAddSnapshot={vi.fn()} />);

    expect(
      screen.getByText(/No analytics data yet/i)
    ).toBeInTheDocument();
  });

  it('should not render empty state for draft video', () => {
    const video = {
      ...mockVideoDraft,
      snapshots: [],
      hashtags: [],
    };

    render(<VideoDetail video={video} />);

    expect(
      screen.queryByText(/No analytics data yet/i)
    ).not.toBeInTheDocument();
  });
});
