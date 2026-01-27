import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoStatus } from '@/lib/generated/client';
import { updateVideoStatus } from './updateVideoStatus';
import { mockVideoDraft, mockVideoPublished, mockVideoArchived } from '@/lib/testing/mocks';

// Mock the DAL functions
vi.mock('@/lib/dal/videos', () => ({
  findVideoById: vi.fn(),
  updateVideo: vi.fn(),
}));

import { findVideoById, updateVideo } from '@/lib/dal/videos';

describe('updateVideoStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('valid transitions', () => {
    it('should allow DRAFT → PUBLISHED', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoDraft);
      vi.mocked(updateVideo).mockResolvedValue({ ...mockVideoDraft, status: VideoStatus.PUBLISHED });

      const result = await updateVideoStatus(mockVideoDraft.id, VideoStatus.PUBLISHED);

      expect(findVideoById).toHaveBeenCalledWith(mockVideoDraft.id);
      expect(updateVideo).toHaveBeenCalledWith(mockVideoDraft.id, {
        status: VideoStatus.PUBLISHED,
      });
      expect(result.status).toBe(VideoStatus.PUBLISHED);
    });

    it('should allow PUBLISHED → ARCHIVED', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
      vi.mocked(updateVideo).mockResolvedValue({ ...mockVideoPublished, status: VideoStatus.ARCHIVED });

      const result = await updateVideoStatus(mockVideoPublished.id, VideoStatus.ARCHIVED);

      expect(result.status).toBe(VideoStatus.ARCHIVED);
    });

    it('should allow status to remain the same', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoDraft);
      vi.mocked(updateVideo).mockResolvedValue(mockVideoDraft);

      const result = await updateVideoStatus(mockVideoDraft.id, VideoStatus.DRAFT);

      expect(result.status).toBe(VideoStatus.DRAFT);
    });
  });

  describe('invalid transitions', () => {
    it('should reject DRAFT → ARCHIVED', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoDraft);

      await expect(
        updateVideoStatus(mockVideoDraft.id, VideoStatus.ARCHIVED)
      ).rejects.toThrow('Invalid status transition');
    });

    it('should reject PUBLISHED → DRAFT', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);

      await expect(
        updateVideoStatus(mockVideoPublished.id, VideoStatus.DRAFT)
      ).rejects.toThrow('Invalid status transition');
    });

    it('should reject ARCHIVED → PUBLISHED', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoArchived);

      await expect(
        updateVideoStatus(mockVideoArchived.id, VideoStatus.PUBLISHED)
      ).rejects.toThrow('Invalid status transition');
    });

    it('should reject ARCHIVED → DRAFT', async () => {
      vi.mocked(findVideoById).mockResolvedValue(mockVideoArchived);

      await expect(
        updateVideoStatus(mockVideoArchived.id, VideoStatus.DRAFT)
      ).rejects.toThrow('Invalid status transition');
    });
  });

  describe('error cases', () => {
    it('should throw error if video not found', async () => {
      vi.mocked(findVideoById).mockResolvedValue(null);

      await expect(
        updateVideoStatus('non-existent-id', VideoStatus.PUBLISHED)
      ).rejects.toThrow('Video with ID non-existent-id not found');
    });
  });
});
