import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoStatus, SnapshotType } from '@/lib/generated/client/client';
import { createSnapshot } from './createSnapshot';
import { mockVideoPublished, mockVideoDraft, mockSnapshotOneHour, mockUser } from '@/lib/testing/mocks';

// Mock the auth server functions
vi.mock('@/lib/auth/server', () => ({
  requireUser: vi.fn(),
}));

// Mock the DAL functions
vi.mock('@/lib/dal/videos', () => ({
  findVideoById: vi.fn(),
}));

vi.mock('@/lib/dal/snapshots', () => ({
  findSnapshotByVideoAndType: vi.fn(),
  createSnapshot: vi.fn(),
}));

import { requireUser } from '@/lib/auth/server';
import { findVideoById } from '@/lib/dal/videos';
import { findSnapshotByVideoAndType, createSnapshot as createSnapshotDAL } from '@/lib/dal/snapshots';

describe('createSnapshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue(mockUser);
  });

  it('should create a snapshot for a published video', async () => {
    const input = {
      videoId: mockVideoPublished.id,
      snapshotType: SnapshotType.THREE_HOUR,
      views: 5000,
      likes: 500,
      comments: 50,
      shares: 25,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotByVideoAndType).mockResolvedValue(null);
    vi.mocked(createSnapshotDAL).mockResolvedValue({
      ...mockSnapshotOneHour,
      snapshotType: SnapshotType.THREE_HOUR,
      views: 5000,
    });

    const result = await createSnapshot(input);

    expect(findVideoById).toHaveBeenCalledWith(mockVideoPublished.id, mockUser.id);
    expect(findSnapshotByVideoAndType).toHaveBeenCalledWith(
      mockVideoPublished.id,
      SnapshotType.THREE_HOUR,
      mockUser.id
    );
    expect(result.views).toBe(5000);
  });

  it('should throw error if video not found', async () => {
    const nonExistentId = '99999999-9999-4999-8999-999999999999';
    const input = {
      videoId: nonExistentId,
      snapshotType: SnapshotType.ONE_HOUR,
    };

    vi.mocked(findVideoById).mockResolvedValue(null);

    await expect(createSnapshot(input)).rejects.toThrow(
      `Video with ID ${nonExistentId} not found`
    );
  });

  it('should throw error if video is not published', async () => {
    const input = {
      videoId: mockVideoDraft.id,
      snapshotType: SnapshotType.ONE_HOUR,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoDraft);

    await expect(createSnapshot(input)).rejects.toThrow(
      'Snapshots can only be created for published videos'
    );
  });

  it('should throw error if snapshot type already exists', async () => {
    const input = {
      videoId: mockVideoPublished.id,
      snapshotType: SnapshotType.ONE_HOUR,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotByVideoAndType).mockResolvedValue(mockSnapshotOneHour);

    await expect(createSnapshot(input)).rejects.toThrow(
      `Snapshot of type ${SnapshotType.ONE_HOUR} already exists for this video`
    );
  });

  it('should reject invalid input', async () => {
    const input = {
      videoId: 'not-a-uuid',
      snapshotType: SnapshotType.ONE_HOUR,
    };

    await expect(createSnapshot(input)).rejects.toThrow();
  });

  it('should handle nullable metrics', async () => {
    const input = {
      videoId: mockVideoPublished.id,
      snapshotType: SnapshotType.ONE_HOUR,
      views: 1000,
      likes: null,
      comments: null,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(findSnapshotByVideoAndType).mockResolvedValue(null);
    vi.mocked(createSnapshotDAL).mockResolvedValue({
      ...mockSnapshotOneHour,
      likes: null,
      comments: null,
    });

    const result = await createSnapshot(input);

    expect(result.likes).toBeNull();
    expect(result.comments).toBeNull();
  });
});
