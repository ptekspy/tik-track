import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSnapshotAction, deleteSnapshotAction } from './actions';
import * as createSnapshotModule from '@/lib/services/createSnapshot';
import * as deleteSnapshotModule from '@/lib/services/deleteSnapshot';
import { mockSnapshotOneHour, mockVideoPublished } from '@/lib/testing/mocks';
import { SnapshotType } from '@/lib/generated/client';

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Snapshot Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSnapshotAction', () => {
    it('should create a snapshot successfully', async () => {
      vi.spyOn(createSnapshotModule, 'createSnapshot').mockResolvedValue(
        mockSnapshotOneHour
      );

      const data = {
        videoId: mockVideoPublished.id,
        snapshotType: SnapshotType.ONE_HOUR,
        views: 1000,
        likes: 100,
      };

      const result = await createSnapshotAction(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSnapshotOneHour);
      expect(result.error).toBeUndefined();
      expect(createSnapshotModule.createSnapshot).toHaveBeenCalledWith(data);
    });

    it('should handle video not published error', async () => {
      const error = new Error('Cannot create snapshot for video with status DRAFT');
      vi.spyOn(createSnapshotModule, 'createSnapshot').mockRejectedValue(error);

      const result = await createSnapshotAction({
        videoId: 'draft-video-id',
        snapshotType: SnapshotType.ONE_HOUR,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot create snapshot for video with status DRAFT');
    });

    it('should handle duplicate snapshot type error', async () => {
      const error = new Error(
        'Snapshot of type ONE_HOUR already exists for this video'
      );
      vi.spyOn(createSnapshotModule, 'createSnapshot').mockRejectedValue(error);

      const result = await createSnapshotAction({
        videoId: mockVideoPublished.id,
        snapshotType: SnapshotType.ONE_HOUR,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed: videoId is required');
      vi.spyOn(createSnapshotModule, 'createSnapshot').mockRejectedValue(error);

      const result = await createSnapshotAction({
        snapshotType: SnapshotType.ONE_HOUR,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed: videoId is required');
    });

    it('should handle unknown errors', async () => {
      vi.spyOn(createSnapshotModule, 'createSnapshot').mockRejectedValue(
        'Unknown error'
      );

      const result = await createSnapshotAction({});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create snapshot');
    });
  });

  describe('deleteSnapshotAction', () => {
    it('should delete a snapshot successfully', async () => {
      vi.spyOn(deleteSnapshotModule, 'deleteSnapshot').mockResolvedValue(undefined);

      const result = await deleteSnapshotAction('snapshot-id', 'video-id');

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeUndefined();
      expect(deleteSnapshotModule.deleteSnapshot).toHaveBeenCalledWith('snapshot-id');
    });

    it('should handle snapshot not found error', async () => {
      const error = new Error('Snapshot with ID snapshot-id not found');
      vi.spyOn(deleteSnapshotModule, 'deleteSnapshot').mockRejectedValue(error);

      const result = await deleteSnapshotAction('snapshot-id', 'video-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Snapshot with ID snapshot-id not found');
    });

    it('should handle unknown errors', async () => {
      vi.spyOn(deleteSnapshotModule, 'deleteSnapshot').mockRejectedValue(
        new Error('DB error')
      );

      const result = await deleteSnapshotAction('snapshot-id', 'video-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('DB error');
    });
  });
});
