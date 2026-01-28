import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Prisma } from '@/lib/generated/client/client';
import { getVideoWithAnalytics } from './getVideoWithAnalytics';
import { 
  mockVideoPublished, 
  mockSnapshotOneHour, 
  mockSnapshotOneDay,
  mockSnapshotSevenDay,
  mockUser 
} from '@/lib/testing/mocks';

// Mock auth
vi.mock('@/lib/auth/server', () => ({
  requireUser: vi.fn(),
}));

// Mock the DAL functions
vi.mock('@/lib/dal/videos', () => ({
  findVideoById: vi.fn(),
}));

vi.mock('@/lib/dal/snapshots', () => ({
  findSnapshotsByVideoId: vi.fn(),
}));

import { requireUser } from '@/lib/auth/server';
import { findVideoById } from '@/lib/dal/videos';
import { findSnapshotsByVideoId } from '@/lib/dal/snapshots';

describe('getVideoWithAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue(mockUser);
  });

  it('should return video with calculated metrics for snapshots', async () => {
    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([mockSnapshotOneHour]);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);

    expect(result.id).toBe(mockVideoPublished.id);
    expect(result.snapshots).toHaveLength(1);
    
    const snapshot = result.snapshots[0];
    expect(snapshot).toHaveProperty('engagementRate');
    expect(snapshot).toHaveProperty('shareRate');
    expect(snapshot).toHaveProperty('retentionRate');
    expect(snapshot).toHaveProperty('followerConversion');
    expect(snapshot).toHaveProperty('signal');
  });

  it('should calculate metrics correctly', async () => {
    const testSnapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      likes: 100,
      comments: 50,
      shares: 25,
      newFollowers: 10,
      avgWatchTimeSeconds: 15 as any, // Mock uses number instead of Decimal for simplicity
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([testSnapshot] as any);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);
    const snapshot = result.snapshots[0];

    // (100 + 50 + 25) / 1000 * 100 = 17.5%
    expect(snapshot.engagementRate).toBe(17.5);
    
    // 25 / 1000 * 100 = 2.5%
    expect(snapshot.shareRate).toBe(2.5);
    
    // 10 / 1000 * 100 = 1%
    expect(snapshot.followerConversion).toBe(1);
    
    // 15 / 60 * 100 = 25% (mockVideoPublished.videoLengthSeconds is 60)
    expect(snapshot.retentionRate).toBe(25);
  });

  it('should detect positive signal', async () => {
    const positiveSnapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      likes: 100,
      comments: 50,
      shares: 40, // 4% share rate > 3%
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([positiveSnapshot]);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);

    expect(result.snapshots[0].signal).toBe('positive');
  });

  it('should detect negative signal', async () => {
    // Create snapshot with low completion rate AND low engagement
    const negativeSnapshot: typeof mockSnapshotOneHour = {
      ...mockSnapshotOneHour,
      completionRate: new Prisma.Decimal(15), // < 20% - negative signal
      views: 1000,
      likes: 5,     // engagement rate = (5 + 2 + 1) / 1000 * 100 = 0.8% < 1% - negative signal
      comments: 2,
      shares: 1,
      newFollowers: 1,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([negativeSnapshot]);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);

    expect(result.snapshots[0].signal).toBe('negative');
  });

  it('should handle multiple snapshots', async () => {
    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([
      mockSnapshotOneHour,
      mockSnapshotOneDay,
      mockSnapshotSevenDay,
    ]);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);

    expect(result.snapshots).toHaveLength(3);
    result.snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('engagementRate');
      expect(snapshot).toHaveProperty('signal');
    });
  });

  it('should handle video with no snapshots', async () => {
    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([]);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);

    expect(result.snapshots).toHaveLength(0);
  });

  it('should throw error if video not found', async () => {
    vi.mocked(findVideoById).mockResolvedValue(null);

    await expect(
      getVideoWithAnalytics('non-existent-id')
    ).rejects.toThrow('Video with ID non-existent-id not found');
  });

  it('should handle null metrics gracefully', async () => {
    const snapshotWithNulls = {
      ...mockSnapshotOneHour,
      views: null,
      likes: null,
      comments: null,
      shares: null,
      newFollowers: null,
      avgWatchTimeSeconds: null,
      completionRate: null,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotsByVideoId).mockResolvedValue([snapshotWithNulls]);

    const result = await getVideoWithAnalytics(mockVideoPublished.id);

    expect(result.snapshots[0].engagementRate).toBeNull();
    expect(result.snapshots[0].shareRate).toBeNull();
    expect(result.snapshots[0].followerConversion).toBeNull();
    expect(result.snapshots[0].retentionRate).toBeNull();
    expect(result.snapshots[0].signal).toBe('neutral');
  });
});
