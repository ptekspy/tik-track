import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoStatus } from '@/lib/generated/client/client';
import {
  findVideoById,
  findAllVideos,
  findVideosByStatus,
  createVideo,
  updateVideo,
  deleteVideo,
} from './videos';
import { mockVideoDraft, mockVideoPublished, mockVideoArchived, MOCK_USER_ID } from '@/lib/testing/mocks';

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

      const result = await findVideoById(mockVideoPublished.id, MOCK_USER_ID);

      expect(db.video.findUnique).toHaveBeenCalledWith({
        where: { id: mockVideoPublished.id, userId: MOCK_USER_ID },
      });
      expect(result).toEqual(mockVideoPublished);
    });

    it('should return null if video not found', async () => {
      vi.mocked(db.video.findUnique).mockResolvedValue(null);

      const result = await findVideoById('non-existent-id', MOCK_USER_ID);

      expect(result).toBeNull();
    });
  });

  describe('findAllVideos', () => {
    it('should return all videos ordered by createdAt desc', async () => {
      const mockVideos = [mockVideoPublished, mockVideoDraft, mockVideoArchived];
      vi.mocked(db.video.findMany).mockResolvedValue(mockVideos);

      const result = await findAllVideos(MOCK_USER_ID);

      expect(db.video.findMany).toHaveBeenCalledWith({
        where: { userId: MOCK_USER_ID },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockVideos);
    });

    it('should return empty array if no videos', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([]);

      const result = await findAllVideos(MOCK_USER_ID);

      expect(result).toEqual([]);
    });
  });

  describe('findVideosByStatus', () => {
    it('should find videos by DRAFT status', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([mockVideoDraft]);

      const result = await findVideosByStatus(VideoStatus.DRAFT, MOCK_USER_ID);

      expect(db.video.findMany).toHaveBeenCalledWith({
        where: { status: VideoStatus.DRAFT, userId: MOCK_USER_ID },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockVideoDraft]);
    });

    it('should find videos by PUBLISHED status', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([mockVideoPublished]);

      const result = await findVideosByStatus(VideoStatus.PUBLISHED, MOCK_USER_ID);

      expect(db.video.findMany).toHaveBeenCalledWith({
        where: { status: VideoStatus.PUBLISHED, userId: MOCK_USER_ID },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockVideoPublished]);
    });

    it('should find videos by ARCHIVED status', async () => {
      vi.mocked(db.video.findMany).mockResolvedValue([mockVideoArchived]);

      const result = await findVideosByStatus(VideoStatus.ARCHIVED, MOCK_USER_ID);

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

      const result = await createVideo(newVideoData, MOCK_USER_ID, 'test-channel-id');

      expect(db.video.create).toHaveBeenCalledWith({
        data: {
          ...newVideoData,
          userId: MOCK_USER_ID,
          channelId: 'test-channel-id',
        },
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

      const result = await updateVideo(mockVideoDraft.id, updateData, MOCK_USER_ID);

      expect(db.video.update).toHaveBeenCalledWith({
        where: { id: mockVideoDraft.id, userId: MOCK_USER_ID },
        data: updateData,
      });
      expect(result).toEqual(updatedVideo);
    });
  });

  describe('deleteVideo', () => {
    it('should delete a video', async () => {
      vi.mocked(db.video.delete).mockResolvedValue(mockVideoDraft);

      const result = await deleteVideo(mockVideoDraft.id, MOCK_USER_ID);

      expect(db.video.delete).toHaveBeenCalledWith({
        where: { id: mockVideoDraft.id, userId: MOCK_USER_ID },
      });
      expect(result).toEqual(mockVideoDraft);
    });
  });
});
