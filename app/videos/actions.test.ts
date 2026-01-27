import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createVideoAction,
  updateVideoAction,
  updateVideoStatusAction,
  deleteVideoAction,
} from './actions';
import * as createVideoModule from '@/lib/services/createVideo';
import * as updateVideoModule from '@/lib/services/updateVideo';
import * as updateVideoStatusModule from '@/lib/services/updateVideoStatus';
import * as deleteVideoModule from '@/lib/services/deleteVideo';
import { mockVideoPublished, mockVideoDraft } from '@/lib/testing/mocks';
import { VideoStatus } from '@/lib/generated/client';

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Video Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createVideoAction', () => {
    it('should create a video successfully', async () => {
      vi.spyOn(createVideoModule, 'createVideo').mockResolvedValue(mockVideoDraft);

      const data = {
        title: 'New Video',
        script: 'Script content',
        description: 'Description',
        videoLengthSeconds: 60,
        status: VideoStatus.DRAFT,
      };

      const result = await createVideoAction(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVideoDraft);
      expect(result.error).toBeUndefined();
      expect(createVideoModule.createVideo).toHaveBeenCalledWith(data);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed: title is required');
      vi.spyOn(createVideoModule, 'createVideo').mockRejectedValue(error);

      const result = await createVideoAction({});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed: title is required');
      expect(result.data).toBeUndefined();
    });

    it('should handle unknown errors', async () => {
      vi.spyOn(createVideoModule, 'createVideo').mockRejectedValue('Unknown error');

      const result = await createVideoAction({});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create video');
    });
  });

  describe('updateVideoAction', () => {
    it('should update a video successfully', async () => {
      vi.spyOn(updateVideoModule, 'updateVideo').mockResolvedValue(mockVideoPublished);

      const data = { title: 'Updated Title' };
      const result = await updateVideoAction('video-id', data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVideoPublished);
      expect(updateVideoModule.updateVideo).toHaveBeenCalledWith('video-id', data);
    });

    it('should handle video not found error', async () => {
      const error = new Error('Video with ID video-id not found');
      vi.spyOn(updateVideoModule, 'updateVideo').mockRejectedValue(error);

      const result = await updateVideoAction('video-id', {});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Video with ID video-id not found');
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed: videoLengthSeconds must be positive');
      vi.spyOn(updateVideoModule, 'updateVideo').mockRejectedValue(error);

      const result = await updateVideoAction('video-id', { videoLengthSeconds: -1 });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed: videoLengthSeconds must be positive');
    });
  });

  describe('updateVideoStatusAction', () => {
    it('should update video status successfully', async () => {
      vi.spyOn(updateVideoStatusModule, 'updateVideoStatus').mockResolvedValue(
        mockVideoPublished
      );

      const result = await updateVideoStatusAction('video-id', VideoStatus.PUBLISHED);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockVideoPublished);
      expect(updateVideoStatusModule.updateVideoStatus).toHaveBeenCalledWith(
        'video-id',
        VideoStatus.PUBLISHED
      );
    });

    it('should handle invalid status transition', async () => {
      const error = new Error('Invalid status transition from PUBLISHED to DRAFT');
      vi.spyOn(updateVideoStatusModule, 'updateVideoStatus').mockRejectedValue(error);

      const result = await updateVideoStatusAction('video-id', VideoStatus.DRAFT);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid status transition from PUBLISHED to DRAFT');
    });

    it('should handle missing postDate error', async () => {
      const error = new Error(
        'Cannot publish video without postDate. Use updateVideo to set postDate first.'
      );
      vi.spyOn(updateVideoStatusModule, 'updateVideoStatus').mockRejectedValue(error);

      const result = await updateVideoStatusAction('video-id', VideoStatus.PUBLISHED);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot publish video without postDate');
    });
  });

  describe('deleteVideoAction', () => {
    it('should delete a video successfully', async () => {
      vi.spyOn(deleteVideoModule, 'deleteVideo').mockResolvedValue(undefined);

      const result = await deleteVideoAction('video-id');

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeUndefined();
      expect(deleteVideoModule.deleteVideo).toHaveBeenCalledWith('video-id');
    });

    it('should handle video not found error', async () => {
      const error = new Error('Video with ID video-id not found');
      vi.spyOn(deleteVideoModule, 'deleteVideo').mockRejectedValue(error);

      const result = await deleteVideoAction('video-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Video with ID video-id not found');
    });

    it('should handle unknown errors', async () => {
      vi.spyOn(deleteVideoModule, 'deleteVideo').mockRejectedValue(new Error('DB error'));

      const result = await deleteVideoAction('video-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('DB error');
    });
  });
});
