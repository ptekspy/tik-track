import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashtagDetail, HashtagStats } from './HashtagDetail';
import { HashtagWithVideos } from '@/lib/types/hashtag';
import { VideoStatus } from '@/lib/generated/client';

const mockHashtagWithVideos: HashtagWithVideos = {
  id: 'hashtag-1',
  tag: 'productivity',
  createdAt: new Date('2026-01-15T10:00:00Z'),
  videos: [
    {
      videoId: 'video-1',
      hashtagId: 'hashtag-1',
      position: 1,
      video: {
        id: 'video-1',
        title: 'My First Video',
        script: 'Script content',
        description: 'A great productivity video',
        videoLengthSeconds: 60,
        postDate: new Date('2026-01-20T10:00:00Z'),
        status: VideoStatus.PUBLISHED,
        createdAt: new Date('2026-01-15T10:00:00Z'),
        updatedAt: new Date('2026-01-20T10:00:00Z'),
      },
    },
    {
      videoId: 'video-2',
      hashtagId: 'hashtag-1',
      position: 2,
      video: {
        id: 'video-2',
        title: 'My Second Video',
        script: 'Another script',
        description: 'More productivity tips',
        videoLengthSeconds: 45,
        postDate: new Date('2026-01-22T10:00:00Z'),
        status: VideoStatus.PUBLISHED,
        createdAt: new Date('2026-01-16T10:00:00Z'),
        updatedAt: new Date('2026-01-22T10:00:00Z'),
      },
    },
  ],
};

const mockStats: HashtagStats = {
  totalVideos: 2,
  publishedVideos: 2,
  totalViews: 50000,
  avgViews: 25000,
  avgEngagementRate: 12.5,
  avgCompletionRate: 68.3,
};

const mockHashtagEmpty: HashtagWithVideos = {
  id: 'hashtag-2',
  tag: 'empty',
  createdAt: new Date('2026-01-17T10:00:00Z'),
  videos: [],
};

const mockStatsEmpty: HashtagStats = {
  totalVideos: 0,
  publishedVideos: 0,
  totalViews: 0,
  avgViews: 0,
  avgEngagementRate: null,
  avgCompletionRate: null,
};

describe('HashtagDetail', () => {
  it('should render hashtag tag with hash symbol', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText('#productivity')).toBeInTheDocument();
  });

  it('should render creation date', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText(/created jan 15, 2026/i)).toBeInTheDocument();
  });

  it('should render all stat cards', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText(/^total videos$/i)).toBeInTheDocument();
    expect(screen.getByText(/^published videos$/i)).toBeInTheDocument();
    expect(screen.getByText(/^total views$/i)).toBeInTheDocument();
    expect(screen.getByText(/^avg views$/i)).toBeInTheDocument();
    expect(screen.getByText(/^avg engagement$/i)).toBeInTheDocument();
    expect(screen.getByText(/^avg completion$/i)).toBeInTheDocument();
  });

  it('should render formatted stat values', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    // Both total and published videos have value 2
    const twoValues = screen.getAllByText('2');
    expect(twoValues.length).toBeGreaterThanOrEqual(2);
    
    expect(screen.getByText('50,000')).toBeInTheDocument(); // total views
    expect(screen.getByText('25,000')).toBeInTheDocument(); // avg views
    expect(screen.getByText('13%')).toBeInTheDocument(); // avg engagement (12.5 rounded)
    expect(screen.getByText('68%')).toBeInTheDocument(); // avg completion (68.3 rounded)
  });

  it('should render dash for null stats', () => {
    render(<HashtagDetail hashtag={mockHashtagEmpty} stats={mockStatsEmpty} />);

    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('should render videos list heading', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText(/videos using this hashtag/i)).toBeInTheDocument();
  });

  it('should render all videos', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText('My First Video')).toBeInTheDocument();
    expect(screen.getByText('My Second Video')).toBeInTheDocument();
  });

  it('should render video titles as links', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    const link1 = screen.getByRole('link', { name: 'My First Video' });
    expect(link1).toHaveAttribute('href', '/videos/video-1');

    const link2 = screen.getByRole('link', { name: 'My Second Video' });
    expect(link2).toHaveAttribute('href', '/videos/video-2');
  });

  it('should render video status badges', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    const badges = screen.getAllByText('Published');
    expect(badges).toHaveLength(2);
  });

  it('should render video post dates', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText(/posted jan 20, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/posted jan 22, 2026/i)).toBeInTheDocument();
  });

  it('should render video descriptions', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText('A great productivity video')).toBeInTheDocument();
    expect(screen.getByText('More productivity tips')).toBeInTheDocument();
  });

  it('should render hashtag position for each video', () => {
    render(<HashtagDetail hashtag={mockHashtagWithVideos} stats={mockStats} />);

    expect(screen.getByText('Position #1')).toBeInTheDocument();
    expect(screen.getByText('Position #2')).toBeInTheDocument();
  });

  it('should render empty state when no videos', () => {
    render(<HashtagDetail hashtag={mockHashtagEmpty} stats={mockStatsEmpty} />);

    expect(screen.getByText(/no videos are using this hashtag yet/i)).toBeInTheDocument();
  });

  it('should not render description if video has none', () => {
    const hashtagWithNoDesc: HashtagWithVideos = {
      ...mockHashtagWithVideos,
      videos: [
        {
          ...mockHashtagWithVideos.videos[0],
          video: {
            ...mockHashtagWithVideos.videos[0].video,
            description: '',
          },
        },
      ],
    };

    render(<HashtagDetail hashtag={hashtagWithNoDesc} stats={mockStats} />);

    expect(screen.queryByText('A great productivity video')).not.toBeInTheDocument();
  });

  it('should not render post date if video not posted', () => {
    const hashtagWithDraft: HashtagWithVideos = {
      ...mockHashtagWithVideos,
      videos: [
        {
          ...mockHashtagWithVideos.videos[0],
          video: {
            ...mockHashtagWithVideos.videos[0].video,
            status: VideoStatus.DRAFT,
            postDate: null,
          },
        },
      ],
    };

    render(<HashtagDetail hashtag={hashtagWithDraft} stats={mockStats} />);

    expect(screen.queryByText(/posted/i)).not.toBeInTheDocument();
  });
});
