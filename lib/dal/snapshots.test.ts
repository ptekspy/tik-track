import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SnapshotType } from '@/lib/generated/client/client';
import {
  findSnapshotById,
  findSnapshotsByVideoId,
  findSnapshotByVideoAndType,
  createSnapshot,
  updateSnapshot,
  deleteSnapshot,
} from './snapshots';
import {
  mockSnapshotOneHour,
  mockSnapshotOneDay,
  mockSnapshotSevenDay,
  mockVideoPublished,
  MOCK_USER_ID,
} from '@/lib/testing/mocks';

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    analyticsSnapshot: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { db } from '@/lib/database/client';

describe('DAL - Snapshots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findSnapshotById', () => {
    it('should find a snapshot by id', async () => {
      vi.mocked(db.analyticsSnapshot.findFirst).mockResolvedValue(mockSnapshotOneHour);

      const result = await findSnapshotById(mockSnapshotOneHour.id, MOCK_USER_ID);

      expect(db.analyticsSnapshot.findFirst).toHaveBeenCalledWith({
        where: { id: mockSnapshotOneHour.id, userId: MOCK_USER_ID },
      });
      expect(result).toEqual(mockSnapshotOneHour);
    });

    it('should return null if snapshot not found', async () => {
      vi.mocked(db.analyticsSnapshot.findFirst).mockResolvedValue(null);

      const result = await findSnapshotById('non-existent-id', MOCK_USER_ID);

      expect(result).toBeNull();
    });
  });

  describe('findSnapshotsByVideoId', () => {
    it('should return all snapshots for a video ordered by recordedAt', async () => {
      const mockSnapshots = [mockSnapshotOneHour, mockSnapshotOneDay, mockSnapshotSevenDay];
      vi.mocked(db.analyticsSnapshot.findMany).mockResolvedValue(mockSnapshots);

      const result = await findSnapshotsByVideoId(mockVideoPublished.id, MOCK_USER_ID);

      expect(db.analyticsSnapshot.findMany).toHaveBeenCalledWith({
        where: { videoId: mockVideoPublished.id, userId: MOCK_USER_ID },
        orderBy: { recordedAt: 'asc' },
      });
      expect(result).toEqual(mockSnapshots);
    });

    it('should return empty array if no snapshots', async () => {
      vi.mocked(db.analyticsSnapshot.findMany).mockResolvedValue([]);

      const result = await findSnapshotsByVideoId('video-id', MOCK_USER_ID);

      expect(result).toEqual([]);
    });
  });

  describe('findSnapshotByVideoAndType', () => {
    it('should find a snapshot by video ID and type', async () => {
      vi.mocked(db.analyticsSnapshot.findFirst).mockResolvedValue(mockSnapshotOneHour);

      const result = await findSnapshotByVideoAndType(
        mockVideoPublished.id,
        SnapshotType.ONE_HOUR,
        MOCK_USER_ID
      );

      expect(db.analyticsSnapshot.findFirst).toHaveBeenCalledWith({
        where: {
          videoId: mockVideoPublished.id,
          snapshotType: SnapshotType.ONE_HOUR,
          userId: MOCK_USER_ID,
        },
      });
      expect(result).toEqual(mockSnapshotOneHour);
    });

    it('should return null if snapshot type does not exist for video', async () => {
      vi.mocked(db.analyticsSnapshot.findFirst).mockResolvedValue(null);

      const result = await findSnapshotByVideoAndType(
        mockVideoPublished.id,
        SnapshotType.THIRTY_DAY,
        MOCK_USER_ID
      );

      expect(result).toBeNull();
    });
  });

  describe('createSnapshot', () => {
    it('should create a new snapshot', async () => {
      const newSnapshotData = {
        video: { connect: { id: mockVideoPublished.id } },
        snapshotType: SnapshotType.THREE_HOUR,
        views: 500,
        likes: 50,
      };

      vi.mocked(db.analyticsSnapshot.create).mockResolvedValue(mockSnapshotOneHour);

      const result = await createSnapshot(newSnapshotData, MOCK_USER_ID, 'test-channel-id');

      expect(db.analyticsSnapshot.create).toHaveBeenCalledWith({
        data: {
          ...newSnapshotData,
          userId: MOCK_USER_ID,
          channelId: 'test-channel-id',
        },
      });
      expect(result).toEqual(mockSnapshotOneHour);
    });
  });

  describe('updateSnapshot', () => {
    it('should update a snapshot', async () => {
      const updateData = {
        views: 2000,
        likes: 200,
      };

      const updatedSnapshot = { ...mockSnapshotOneHour, views: 2000, likes: 200 };
      vi.mocked(db.analyticsSnapshot.update).mockResolvedValue(updatedSnapshot);

      const result = await updateSnapshot(mockSnapshotOneHour.id, updateData, MOCK_USER_ID);

      expect(db.analyticsSnapshot.update).toHaveBeenCalledWith({
        where: { id: mockSnapshotOneHour.id, userId: MOCK_USER_ID },
        data: updateData,
      });
      expect(result).toEqual(updatedSnapshot);
    });
  });

  describe('deleteSnapshot', () => {
    it('should delete a snapshot', async () => {
      vi.mocked(db.analyticsSnapshot.delete).mockResolvedValue(mockSnapshotOneHour);

      const result = await deleteSnapshot(mockSnapshotOneHour.id, MOCK_USER_ID);

      expect(db.analyticsSnapshot.delete).toHaveBeenCalledWith({
        where: { id: mockSnapshotOneHour.id, userId: MOCK_USER_ID },
      });
      expect(result).toEqual(mockSnapshotOneHour);
    });
  });
});
