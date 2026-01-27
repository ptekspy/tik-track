import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashtagList } from './HashtagList';
import type { HashtagWithStats } from '@/lib/types/hashtag';

const mockHashtagStats: HashtagWithStats = {
  id: 'hashtag-1',
  tag: 'productivity',
  createdAt: new Date('2026-01-15T10:00:00Z'),
  videoCount: 5,
  avgViews: 25000,
  avgEngagementRate: 12.5,
  avgCompletionRate: 68.3,
};

const mockHashtagStats2: HashtagWithStats = {
  id: 'hashtag-2',
  tag: 'tutorial',
  createdAt: new Date('2026-01-16T10:00:00Z'),
  videoCount: 3,
  avgViews: 18000,
  avgEngagementRate: 15.2,
  avgCompletionRate: 72.1,
};

const mockHashtagWithNulls: HashtagWithStats = {
  id: 'hashtag-3',
  tag: 'newhashtag',
  createdAt: new Date('2026-01-17T10:00:00Z'),
  videoCount: 0,
  avgViews: null,
  avgEngagementRate: null,
  avgCompletionRate: null,
};

describe('HashtagList', () => {
  it('should render empty state when no hashtags provided', () => {
    render(<HashtagList hashtags={[]} />);

    expect(screen.getByText(/no hashtags found/i)).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    expect(screen.getByText(/^tag$/i)).toBeInTheDocument();
    expect(screen.getByText(/^videos$/i)).toBeInTheDocument();
    expect(screen.getByText(/^avg views$/i)).toBeInTheDocument();
    expect(screen.getByText(/^avg engagement$/i)).toBeInTheDocument();
    expect(screen.getByText(/^avg completion$/i)).toBeInTheDocument();
  });

  it('should render hashtag tag with hash symbol', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    expect(screen.getByText('#productivity')).toBeInTheDocument();
  });

  it('should render hashtag tag as link to detail page', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    const link = screen.getByRole('link', { name: '#productivity' });
    expect(link).toHaveAttribute('href', '/hashtags/productivity');
  });

  it('should render video count', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render formatted average views', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    expect(screen.getByText('25,000')).toBeInTheDocument();
  });

  it('should render rounded average engagement rate', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    // 12.5 rounds to 13
    expect(screen.getByText('13%')).toBeInTheDocument();
  });

  it('should render rounded average completion rate', () => {
    render(<HashtagList hashtags={[mockHashtagStats]} />);

    // 68.3 rounds to 68
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('should render dash for null average values', () => {
    render(<HashtagList hashtags={[mockHashtagWithNulls]} />);

    const dashes = screen.getAllByText('—');
    // Should have 3 dashes for avgViews, avgEngagement, avgCompletion
    expect(dashes.length).toBe(3);
  });

  it('should render multiple hashtags', () => {
    render(<HashtagList hashtags={[mockHashtagStats, mockHashtagStats2]} />);

    expect(screen.getByText('#productivity')).toBeInTheDocument();
    expect(screen.getByText('#tutorial')).toBeInTheDocument();
  });

  it('should encode hashtag tag in URL', () => {
    const hashtagWithSpaces = {
      ...mockHashtagStats,
      tag: 'my tag',
    };

    render(<HashtagList hashtags={[hashtagWithSpaces]} />);

    const link = screen.getByRole('link', { name: '#my tag' });
    expect(link).toHaveAttribute('href', '/hashtags/my%20tag');
  });

  it('should display zero video count', () => {
    render(<HashtagList hashtags={[mockHashtagWithNulls]} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
