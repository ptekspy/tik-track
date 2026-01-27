import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateVideo } from './updateVideo';
import { mockVideoPublished } from '@/lib/testing/mocks';

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    $transaction: vi.fn(),
  },
}));

// Mock the DAL functions
vi.mock('@/lib/dal/videos', () => ({
  findVideoById: vi.fn(),
  updateVideo: vi.fn(),
}));

import { db } from '@/lib/database/client';
import { findVideoById } from '@/lib/dal/videos';

describe('updateVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update video title', async () => {
    const input = {
      title: 'Updated Title',
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    
    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue({ ...mockVideoPublished, title: 'Updated Title' }),
        },
        videoHashtag: {
          deleteMany: vi.fn(),
          create: vi.fn(),
        },
        hashtag: {
          upsert: vi.fn(),
        },
      };
      return callback(tx);
    });

    const result = await updateVideo(mockVideoPublished.id, input);

    expect(result.title).toBe('Updated Title');
  });

  it('should update multiple fields', async () => {
    const input = {
      title: 'New Title',
      description: 'New Description',
      videoLengthSeconds: 45,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    
    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue({
            ...mockVideoPublished,
            title: 'New Title',
            description: 'New Description',
            videoLengthSeconds: 45,
          }),
        },
        videoHashtag: {
          deleteMany: vi.fn(),
          create: vi.fn(),
        },
        hashtag: {
          upsert: vi.fn(),
        },
      };
      return callback(tx);
    });

    const result = await updateVideo(mockVideoPublished.id, input);

    expect(result.title).toBe('New Title');
    expect(result.description).toBe('New Description');
    expect(result.videoLengthSeconds).toBe(45);
  });

  it('should update hashtags', async () => {
    const input = {
      hashtags: ['newhashtag1', 'newhashtag2'],
    };

    const mockHashtag1 = { id: 'h1', tag: 'newhashtag1', createdAt: new Date() };
    const mockHashtag2 = { id: 'h2', tag: 'newhashtag2', createdAt: new Date() };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);

    const deleteManyMock = vi.fn().mockResolvedValue({ count: 2 });
    const upsertMock = vi.fn()
      .mockResolvedValueOnce(mockHashtag1)
      .mockResolvedValueOnce(mockHashtag2);
    const createMock = vi.fn();

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue(mockVideoPublished),
        },
        videoHashtag: {
          deleteMany: deleteManyMock,
          create: createMock,
        },
        hashtag: {
          upsert: upsertMock,
        },
      };
      return callback(tx);
    });

    await updateVideo(mockVideoPublished.id, input);

    expect(deleteManyMock).toHaveBeenCalledWith({
      where: { videoId: mockVideoPublished.id },
    });
    expect(upsertMock).toHaveBeenCalledTimes(2);
    expect(createMock).toHaveBeenCalledTimes(2);
  });

  it('should clear all hashtags when empty array provided', async () => {
    const input = {
      hashtags: [],
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);

    const deleteManyMock = vi.fn().mockResolvedValue({ count: 2 });

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue(mockVideoPublished),
        },
        videoHashtag: {
          deleteMany: deleteManyMock,
          create: vi.fn(),
        },
        hashtag: {
          upsert: vi.fn(),
        },
      };
      return callback(tx);
    });

    await updateVideo(mockVideoPublished.id, input);

    expect(deleteManyMock).toHaveBeenCalled();
  });

  it('should not touch hashtags if not provided in input', async () => {
    const input = {
      title: 'Updated Title',
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);

    const deleteManyMock = vi.fn();

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue({ ...mockVideoPublished, title: 'Updated Title' }),
        },
        videoHashtag: {
          deleteMany: deleteManyMock,
          create: vi.fn(),
        },
        hashtag: {
          upsert: vi.fn(),
        },
      };
      return callback(tx);
    });

    await updateVideo(mockVideoPublished.id, input);

    expect(deleteManyMock).not.toHaveBeenCalled();
  });

  it('should update postDate to null', async () => {
    const input = {
      postDate: null,
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue({ ...mockVideoPublished, postDate: null }),
        },
        videoHashtag: {
          deleteMany: vi.fn(),
          create: vi.fn(),
        },
        hashtag: {
          upsert: vi.fn(),
        },
      };
      return callback(tx);
    });

    const result = await updateVideo(mockVideoPublished.id, input);

    expect(result.postDate).toBeNull();
  });

  it('should throw error if video not found', async () => {
    vi.mocked(findVideoById).mockResolvedValue(null);

    await expect(
      updateVideo('non-existent-id', { title: 'New Title' })
    ).rejects.toThrow('Video with ID non-existent-id not found');
  });

  it('should reject invalid input', async () => {
    const input = {
      title: '', // empty title
    };

    await expect(updateVideo(mockVideoPublished.id, input)).rejects.toThrow();
  });

  it('should handle combined metadata and hashtag updates', async () => {
    const input = {
      title: 'Updated Title',
      hashtags: ['newtag'],
    };

    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);

    const mockHashtag = { id: 'h1', tag: 'newtag', createdAt: new Date() };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          update: vi.fn().mockResolvedValue({ ...mockVideoPublished, title: 'Updated Title' }),
        },
        videoHashtag: {
          deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
          create: vi.fn(),
        },
        hashtag: {
          upsert: vi.fn().mockResolvedValue(mockHashtag),
        },
      };
      return callback(tx);
    });

    const result = await updateVideo(mockVideoPublished.id, input);

    expect(result.title).toBe('Updated Title');
  });
});
