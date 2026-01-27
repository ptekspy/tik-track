import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  findHashtagByTag,
  findOrCreateHashtag,
  findAllHashtags,
  findHashtagWithVideos,
  deleteHashtag,
  linkHashtagToVideo,
  unlinkHashtagFromVideo,
  updateVideoHashtagPositions,
} from './hashtags';
import {
  mockHashtag1,
  mockHashtag2,
  mockHashtag3,
  mockHashtagWithVideos,
  mockVideoPublished,
} from '@/lib/testing/mocks';

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    hashtag: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    videoHashtag: {
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { db } from '@/lib/database/client';

describe('DAL - Hashtags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findHashtagByTag', () => {
    it('should find a hashtag by tag (case insensitive)', async () => {
      vi.mocked(db.hashtag.findUnique).mockResolvedValue(mockHashtag1);

      const result = await findHashtagByTag('FYP');

      expect(db.hashtag.findUnique).toHaveBeenCalledWith({
        where: { tag: 'fyp' },
      });
      expect(result).toEqual(mockHashtag1);
    });

    it('should return null if hashtag not found', async () => {
      vi.mocked(db.hashtag.findUnique).mockResolvedValue(null);

      const result = await findHashtagByTag('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findOrCreateHashtag', () => {
    it('should create a new hashtag if it does not exist', async () => {
      const newTag = 'newtag';
      const newHashtag = { ...mockHashtag1, tag: newTag };
      vi.mocked(db.hashtag.upsert).mockResolvedValue(newHashtag);

      const result = await findOrCreateHashtag(newTag);

      expect(db.hashtag.upsert).toHaveBeenCalledWith({
        where: { tag: newTag },
        update: {},
        create: { tag: newTag },
      });
      expect(result).toEqual(newHashtag);
    });

    it('should return existing hashtag if it already exists', async () => {
      vi.mocked(db.hashtag.upsert).mockResolvedValue(mockHashtag1);

      const result = await findOrCreateHashtag('fyp');

      expect(db.hashtag.upsert).toHaveBeenCalledWith({
        where: { tag: 'fyp' },
        update: {},
        create: { tag: 'fyp' },
      });
      expect(result).toEqual(mockHashtag1);
    });
  });

  describe('findAllHashtags', () => {
    it('should return all hashtags ordered by creation date', async () => {
      const mockHashtags = [mockHashtag1, mockHashtag2, mockHashtag3];
      vi.mocked(db.hashtag.findMany).mockResolvedValue(mockHashtags);

      const result = await findAllHashtags();

      expect(db.hashtag.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockHashtags);
    });

    it('should return empty array if no hashtags', async () => {
      vi.mocked(db.hashtag.findMany).mockResolvedValue([]);

      const result = await findAllHashtags();

      expect(result).toEqual([]);
    });
  });

  describe('findHashtagWithVideos', () => {
    it('should find a hashtag with its associated videos', async () => {
      vi.mocked(db.hashtag.findUnique).mockResolvedValue(mockHashtagWithVideos);

      const result = await findHashtagWithVideos('fyp');

      expect(db.hashtag.findUnique).toHaveBeenCalledWith({
        where: { tag: 'fyp' },
        include: {
          videoHashtags: {
            include: {
              video: true,
            },
            orderBy: { position: 'asc' },
          },
        },
      });
      expect(result).toEqual(mockHashtagWithVideos);
    });

    it('should return null if hashtag not found', async () => {
      vi.mocked(db.hashtag.findUnique).mockResolvedValue(null);

      const result = await findHashtagWithVideos('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('deleteHashtag', () => {
    it('should delete a hashtag', async () => {
      vi.mocked(db.hashtag.delete).mockResolvedValue(mockHashtag1);

      const result = await deleteHashtag(mockHashtag1.id);

      expect(db.hashtag.delete).toHaveBeenCalledWith({
        where: { id: mockHashtag1.id },
      });
      expect(result).toEqual(mockHashtag1);
    });
  });

  describe('linkHashtagToVideo', () => {
    it('should link a hashtag to a video at a position', async () => {
      const mockVideoHashtag = {
        videoId: mockVideoPublished.id,
        hashtagId: mockHashtag1.id,
        position: 0,
        createdAt: new Date(),
      };
      vi.mocked(db.videoHashtag.create).mockResolvedValue(mockVideoHashtag);

      const result = await linkHashtagToVideo(mockHashtag1.id, mockVideoPublished.id, 0);

      expect(db.videoHashtag.create).toHaveBeenCalledWith({
        data: {
          hashtagId: mockHashtag1.id,
          videoId: mockVideoPublished.id,
          position: 0,
        },
      });
      expect(result).toEqual(mockVideoHashtag);
    });
  });

  describe('unlinkHashtagFromVideo', () => {
    it('should unlink a hashtag from a video', async () => {
      const mockVideoHashtag = {
        videoId: mockVideoPublished.id,
        hashtagId: mockHashtag1.id,
        position: 0,
        createdAt: new Date(),
      };
      vi.mocked(db.videoHashtag.delete).mockResolvedValue(mockVideoHashtag);

      const result = await unlinkHashtagFromVideo(mockHashtag1.id, mockVideoPublished.id);

      expect(db.videoHashtag.delete).toHaveBeenCalledWith({
        where: {
          videoId_hashtagId: {
            videoId: mockVideoPublished.id,
            hashtagId: mockHashtag1.id,
          },
        },
      });
      expect(result).toEqual(mockVideoHashtag);
    });
  });

  describe('updateVideoHashtagPositions', () => {
    it('should update hashtag positions for a video', async () => {
      const hashtags = [
        { hashtagId: mockHashtag1.id, position: 0 },
        { hashtagId: mockHashtag2.id, position: 1 },
        { hashtagId: mockHashtag3.id, position: 2 },
      ];

      // Mock the transaction to execute the callback
      vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
        const tx = {
          videoHashtag: {
            deleteMany: vi.fn().mockResolvedValue({ count: 3 }),
            createMany: vi.fn().mockResolvedValue({ count: 3 }),
          },
        };
        return callback(tx);
      });

      await updateVideoHashtagPositions(mockVideoPublished.id, hashtags);

      expect(db.$transaction).toHaveBeenCalled();
    });
  });
});
