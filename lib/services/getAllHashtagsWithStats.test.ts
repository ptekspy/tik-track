import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllHashtagsWithStats } from './getAllHashtagsWithStats';
import { mockHashtag1, mockHashtag2, mockVideoPublished, mockVideoDraft, mockSnapshotOneDay } from '@/lib/testing/mocks';
import { VideoStatus } from '@/lib/generated/client';

// Mock the database
vi.mock('@/lib/database/client', () => ({
  db: {
    hashtag: {
      findMany: vi.fn(),
    },
  },
}));

import { db } from '@/lib/database/client';

describe('getAllHashtagsWithStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when no hashtags exist', async () => {
    vi.mocked(db.hashtag.findMany).mockResolvedValue([]);

    const result = await getAllHashtagsWithStats();

    expect(result).toEqual([]);
  });

  it('should return hashtags with stats from published videos only', async () => {
    const videoWithSnapshot = {
      ...mockVideoPublished,
      status: VideoStatus.PUBLISHED,
      snapshots: [mockSnapshotOneDay],
    };

    vi.mocked(db.hashtag.findMany).mockResolvedValue([
      {
        ...mockHashtag1,
        videos: [
          {
            videoId: mockVideoPublished.id,
            hashtagId: mockHashtag1.id,
            position: 0,
            video: videoWithSnapshot,
          },
        ],
      },
    ] as any);

    const result = await getAllHashtagsWithStats();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      tag: 'productivity',
      videoCount: 1,
      publishedVideoCount: 1,
      totalViews: 12500,
      avgEngagementRate: expect.any(Number),
      lastUsed: mockVideoPublished.createdAt,
    });

    // Engagement: (1250 + 85 + 42) / 12500 * 100 = 11.016%
    expect(result[0].avgEngagementRate).toBeCloseTo(11.016, 2);
  });

  it('should exclude draft videos from published stats', async () => {
    const publishedWithSnapshot = {
      ...mockVideoPublished,
      status: VideoStatus.PUBLISHED,
      createdAt: new Date('2026-01-20T10:00:00Z'),
      snapshots: [mockSnapshotOneDay],
    };

    const draftVideo = {
      ...mockVideoDraft,
      status: VideoStatus.DRAFT,
      createdAt: new Date('2026-01-25T10:00:00Z'),
      snapshots: [],
    };

    vi.mocked(db.hashtag.findMany).mockResolvedValue([
      {
        ...mockHashtag1,
        videos: [
          {
            videoId: publishedWithSnapshot.id,
            hashtagId: mockHashtag1.id,
            position: 0,
            video: publishedWithSnapshot,
          },
          {
            videoId: draftVideo.id,
            hashtagId: mockHashtag1.id,
            position: 0,
            video: draftVideo,
          },
        ],
      },
    ] as any);

    const result = await getAllHashtagsWithStats();

    expect(result[0].videoCount).toBe(2); // Total videos
    expect(result[0].publishedVideoCount).toBe(1); // Only published
    expect(result[0].totalViews).toBe(12500); // Only from published
    expect(result[0].lastUsed).toEqual(new Date('2026-01-25T10:00:00Z')); // Most recent (draft)
  });

  it('should handle multiple hashtags and sort alphabetically', async () => {
    const video1 = {
      ...mockVideoPublished,
      id: '00000000-0000-4000-8000-000000000101',
      status: VideoStatus.PUBLISHED,
      snapshots: [mockSnapshotOneDay],
    };

    const video2 = {
      ...mockVideoPublished,
      id: '00000000-0000-4000-8000-000000000102',
      status: VideoStatus.PUBLISHED,
      snapshots: [mockSnapshotOneDay],
    };

    vi.mocked(db.hashtag.findMany).mockResolvedValue([
      {
        ...mockHashtag1, // 'productivity'
        videos: [{ videoId: video1.id, hashtagId: mockHashtag1.id, position: 0, video: video1 }],
      },
      {
        ...mockHashtag2, // 'tips'
        videos: [{ videoId: video2.id, hashtagId: mockHashtag2.id, position: 0, video: video2 }],
      },
    ] as any);

    const result = await getAllHashtagsWithStats();

    expect(result).toHaveLength(2);
    expect(result[0].tag).toBe('productivity');
    expect(result[1].tag).toBe('tips');
  });

  it('should handle videos with no snapshots', async () => {
    const videoNoSnapshot = {
      ...mockVideoPublished,
      status: VideoStatus.PUBLISHED,
      snapshots: [],
    };

    vi.mocked(db.hashtag.findMany).mockResolvedValue([
      {
        ...mockHashtag1,
        videos: [
          {
            videoId: videoNoSnapshot.id,
            hashtagId: mockHashtag1.id,
            position: 0,
            video: videoNoSnapshot,
          },
        ],
      },
    ] as any);

    const result = await getAllHashtagsWithStats();

    expect(result[0].publishedVideoCount).toBe(1);
    expect(result[0].totalViews).toBe(0);
    expect(result[0].avgEngagementRate).toBeNull();
  });

  it('should handle snapshots with null engagement metrics', async () => {
    const snapshotWithNulls = {
      ...mockSnapshotOneDay,
      views: 5000,
      likes: null,
      comments: null,
      shares: null,
    };

    const videoWithNulls = {
      ...mockVideoPublished,
      status: VideoStatus.PUBLISHED,
      snapshots: [snapshotWithNulls],
    };

    vi.mocked(db.hashtag.findMany).mockResolvedValue([
      {
        ...mockHashtag1,
        videos: [
          {
            videoId: videoWithNulls.id,
            hashtagId: mockHashtag1.id,
            position: 0,
            video: videoWithNulls,
          },
        ],
      },
    ] as any);

    const result = await getAllHashtagsWithStats();

    expect(result[0].totalViews).toBe(5000);
    expect(result[0].avgEngagementRate).toBeNull();
  });

  it('should calculate correct averages across multiple videos', async () => {
    const video1 = {
      ...mockVideoPublished,
      id: '00000000-0000-4000-8000-000000000201',
      status: VideoStatus.PUBLISHED,
      createdAt: new Date('2026-01-20T10:00:00Z'),
      snapshots: [{
        ...mockSnapshotOneDay,
        views: 10000,
        likes: 1000,
        comments: 100,
        shares: 50,
      }],
    };

    const video2 = {
      ...mockVideoPublished,
      id: '00000000-0000-4000-8000-000000000202',
      status: VideoStatus.PUBLISHED,
      createdAt: new Date('2026-01-22T10:00:00Z'),
      snapshots: [{
        ...mockSnapshotOneDay,
        id: '10000000-0000-4000-8000-000000000201',
        views: 20000,
        likes: 2000,
        comments: 200,
        shares: 100,
      }],
    };

    vi.mocked(db.hashtag.findMany).mockResolvedValue([
      {
        ...mockHashtag1,
        videos: [
          { videoId: video1.id, hashtagId: mockHashtag1.id, position: 0, video: video1 },
          { videoId: video2.id, hashtagId: mockHashtag1.id, position: 0, video: video2 },
        ],
      },
    ] as any);

    const result = await getAllHashtagsWithStats();

    expect(result[0].videoCount).toBe(2);
    expect(result[0].publishedVideoCount).toBe(2);
    expect(result[0].totalViews).toBe(30000);
    
    // Avg engagement: ((1000+100+50)/10000*100 + (2000+200+100)/20000*100) / 2 = 11.5%
    expect(result[0].avgEngagementRate).toBeCloseTo(11.5, 1);
    
    // Last used should be the most recent video
    expect(result[0].lastUsed).toEqual(new Date('2026-01-22T10:00:00Z'));
  });
});
