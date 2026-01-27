import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHashtagStats } from './getHashtagStats';
import { mockHashtag1, mockVideoPublished, mockSnapshotOneDay } from '@/lib/testing/mocks';
import { VideoStatus } from '@/lib/generated/client';
import { Prisma } from '@/lib/generated/client';

// Mock the DAL and database
vi.mock('@/lib/dal/hashtags', () => ({
  findHashtagByTag: vi.fn(),
}));

vi.mock('@/lib/database/client', () => ({
  db: {
    video: {
      findMany: vi.fn(),
    },
  },
}));

import { findHashtagByTag } from '@/lib/dal/hashtags';
import { db } from '@/lib/database/client';

describe('getHashtagStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if hashtag not found', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(null);

    const result = await getHashtagStats('nonexistent');

    expect(result).toBeNull();
    expect(findHashtagByTag).toHaveBeenCalledWith('nonexistent');
  });

  it('should return zero stats if hashtag has no published videos', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(mockHashtag1);
    vi.mocked(db.video.findMany).mockResolvedValue([]);

    const result = await getHashtagStats('productivity');

    expect(result).toEqual({
      tag: 'productivity',
      videoCount: 0,
      totalViews: 0,
      avgViews: 0,
      avgEngagementRate: null,
      avgCompletionRate: null,
      avgShareRate: null,
    });
  });

  it('should calculate stats from latest snapshots', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(mockHashtag1);
    vi.mocked(db.video.findMany).mockResolvedValue([
      {
        ...mockVideoPublished,
        snapshots: [mockSnapshotOneDay], // Latest snapshot
      },
    ] as any);

    const result = await getHashtagStats('productivity');

    expect(result).toBeDefined();
    expect(result?.tag).toBe('productivity');
    expect(result?.videoCount).toBe(1);
    expect(result?.totalViews).toBe(12500);
    expect(result?.avgViews).toBe(12500);
    
    // Engagement rate: (1250 + 85 + 42) / 12500 * 100 = 11.016%
    expect(result?.avgEngagementRate).toBeCloseTo(11.016, 2);
    
    // Completion rate: 68%
    expect(result?.avgCompletionRate).toBe(68);
    
    // Share rate: 42 / 12500 * 100 = 0.336%
    expect(result?.avgShareRate).toBeCloseTo(0.336, 2);
  });

  it('should handle multiple videos and average correctly', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(mockHashtag1);
    
    const snapshot1 = {
      ...mockSnapshotOneDay,
      views: 10000,
      likes: 1000,
      comments: 100,
      shares: 50,
      completionRate: new Prisma.Decimal(0.70), // 70%
    };
    
    const snapshot2 = {
      ...mockSnapshotOneDay,
      id: '10000000-0000-4000-8000-000000000099',
      views: 20000,
      likes: 2000,
      comments: 200,
      shares: 100,
      completionRate: new Prisma.Decimal(0.80), // 80%
    };

    vi.mocked(db.video.findMany).mockResolvedValue([
      { ...mockVideoPublished, snapshots: [snapshot1] },
      { ...mockVideoPublished, id: '00000000-0000-4000-8000-000000000099', snapshots: [snapshot2] },
    ] as any);

    const result = await getHashtagStats('productivity');

    expect(result?.videoCount).toBe(2);
    expect(result?.totalViews).toBe(30000);
    expect(result?.avgViews).toBe(15000);
    
    // Avg engagement: ((1000+100+50)/10000*100 + (2000+200+100)/20000*100) / 2
    // = (11.5 + 11.5) / 2 = 11.5
    expect(result?.avgEngagementRate).toBeCloseTo(11.5, 1);
    
    // Avg completion: (70 + 80) / 2 = 75
    expect(result?.avgCompletionRate).toBe(75);
    
    // Avg share rate: (50/10000*100 + 100/20000*100) / 2 = (0.5 + 0.5) / 2 = 0.5
    expect(result?.avgShareRate).toBe(0.5);
  });

  it('should handle videos with no snapshots', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(mockHashtag1);
    vi.mocked(db.video.findMany).mockResolvedValue([
      { ...mockVideoPublished, snapshots: [] },
    ] as any);

    const result = await getHashtagStats('productivity');

    expect(result?.videoCount).toBe(1);
    expect(result?.totalViews).toBe(0);
    expect(result?.avgViews).toBe(0);
    expect(result?.avgEngagementRate).toBeNull();
  });

  it('should handle snapshots with null metrics', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(mockHashtag1);
    
    const snapshotWithNulls = {
      ...mockSnapshotOneDay,
      views: 5000,
      likes: null,
      comments: null,
      shares: null,
      completionRate: null,
    };

    vi.mocked(db.video.findMany).mockResolvedValue([
      { ...mockVideoPublished, snapshots: [snapshotWithNulls] },
    ] as any);

    const result = await getHashtagStats('productivity');

    expect(result?.totalViews).toBe(5000);
    expect(result?.avgEngagementRate).toBeNull();
    expect(result?.avgCompletionRate).toBeNull();
    expect(result?.avgShareRate).toBeNull();
  });

  it('should normalize hashtag input (lowercase and trim)', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValue(mockHashtag1);
    vi.mocked(db.video.findMany).mockResolvedValue([]);

    await getHashtagStats('  PRODUCTIVITY  ');

    expect(findHashtagByTag).toHaveBeenCalledWith('productivity');
  });
});
