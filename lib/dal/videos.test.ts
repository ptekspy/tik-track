import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoStatus } from '@/lib/generated/client';
import {
  findVideoById,
  findAllVideos,
  findVideosByStatus,
  createVideo,
  updateVideo,
  deleteVideo,
} from './videos';
import { mockVideoDraft, mockVideoPublished, mockVideoArchived } from '@/lib/testing/mocks';

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    video: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Import the mocked db after mocking
import { db } from '@/lib/database/client';

describe('DAL - Videos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findVideoById', () => {
    it('should find a video by id', async () => {
      vi.mocked(db.video.findUnique).mockResolvedValue(mockVideoPublished);

      const result = await findVideoById(mockVideoPublished.id);

      expect(db.video.findUnique).toHaveBeenCalledWith({
        where: { id: mockVideoPublished.id },
      });
      expect(result).toEqual(mockVideoPublished);
    });

    it('should return null if video not found', async () => {
      vi.mocked(db.video.findUnique).mockResolvedValue(null);

      const result = await findVideoById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAllVideos', () => {
    it('should return all videos ordered by createdAt desc', async () => {
      const mockVideos = [mockVideoPublished, mockVideoDraft, mockVideoArchived];
      vi.mocked(db.video.findMany).mockResolvedValue(mockVideos);

      const result = await findAllVideos();

      expect(db.video.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockVideos);
    });

    it('should return empty array if no videos', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([]);

      const result = await findAllVideos();

      expect(result).toEqual([]);
    });
  });

  describe('findVideosByStatus', () => {
    it('should find videos by DRAFT status', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([mockVideoDraft]);

      const result = await findVideosByStatus(VideoStatus.DRAFT);

      expect(db.video.findMany).toHaveBeenCalledWith({
        where: { status: VideoStatus.DRAFT },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockVideoDraft]);
    });

    it('should find videos by PUBLISHED status', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([mockVideoPublished]);

      const result = await findVideosByStatus(VideoStatus.PUBLISHED);

      expect(db.video.findMany).toHaveBeenCalledWith({
        where: { status: VideoStatus.PUBLISHED },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockVideoPublished]);
    });

    it('should find videos by ARCHIVED status', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([mockVideoArchived]);

      const result = await findVideosByStatus(VideoStatus.ARCHIVED);

      expect(result).toEqual([mockVideoArchived]);
    });
  });

  describe('createVideo', () => {
    it('should create a new video', async () => {
      const newVideoData = {
        title: 'New Video',
        script: 'Test script',
        description: 'Test description',
        videoLengthSeconds: 30,
        status: VideoStatus.DRAFT,
      };

      vi.mocked(db.video.create).mockResolvedValue(mockVideoDraft);

      const result = await createVideo(newVideoData);

      expect(db.video.create).toHaveBeenCalledWith({
        data: newVideoData,
      });
      expect(result).toEqual(mockVideoDraft);
    });
  });

  describe('updateVideo', () => {
    it('should update a video', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      const updatedVideo = { ...mockVideoDraft, ...updateData };
      vi.mocked(db.video.update).mockResolvedValue(updatedVideo);

      const result = await updateVideo(mockVideoDraft.id, updateData);

      expect(db.video.update).toHaveBeenCalledWith({
        where: { id: mockVideoDraft.id },
        data: updateData,
      });
      expect(result).toEqual(updatedVideo);
    });
  });

  describe('deleteVideo', () => {
    it('should delete a video', async () => {
      vi.mocked(db.video.delete).mockResolvedValue(mockVideoDraft);

      const result = await deleteVideo(mockVideoDraft.id);

      expect(db.video.delete).toHaveBeenCalledWith({
        where: { id: mockVideoDraft.id },
      });
      expect(result).toEqual(mockVideoDraft);
    });
  });
});
