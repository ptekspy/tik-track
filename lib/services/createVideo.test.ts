import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoStatus } from '@/lib/generated/client';
import { createVideo } from './createVideo';
import { mockVideoDraft } from '@/lib/testing/mocks';

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    $transaction: vi.fn(),
  },
}));

import { db } from '@/lib/database/client';

describe('createVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a video with valid input', async () => {
    const input = {
      title: 'My TikTok Video',
      script: 'This is the script content',
      description: 'This is the description',
      videoLengthSeconds: 30,
    };

    // Mock the transaction
    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          create: vi.fn().mockResolvedValue(mockVideoDraft),
        },
        hashtag: {
          upsert: vi.fn(),
        },
        videoHashtag: {
          create: vi.fn(),
        },
      };
      return callback(tx);
    });

    const result = await createVideo(input);

    expect(result).toEqual(mockVideoDraft);
    expect(db.$transaction).toHaveBeenCalled();
  });

  it('should create a video with hashtags', async () => {
    const input = {
      title: 'My TikTok Video',
      script: 'This is the script content',
      description: 'This is the description',
      videoLengthSeconds: 30,
      hashtags: ['fyp', 'viral', 'comedy'],
    };

    const mockHashtag1 = { id: 'hashtag-1', tag: 'fyp', createdAt: new Date() };
    const mockHashtag2 = { id: 'hashtag-2', tag: 'viral', createdAt: new Date() };
    const mockHashtag3 = { id: 'hashtag-3', tag: 'comedy', createdAt: new Date() };

    const upsertMock = vi.fn()
      .mockResolvedValueOnce(mockHashtag1)
      .mockResolvedValueOnce(mockHashtag2)
      .mockResolvedValueOnce(mockHashtag3);

    const createHashtagMock = vi.fn();

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          create: vi.fn().mockResolvedValue(mockVideoDraft),
        },
        hashtag: {
          upsert: upsertMock,
        },
        videoHashtag: {
          create: createHashtagMock,
        },
      };
      return callback(tx);
    });

    const result = await createVideo(input);

    expect(result).toEqual(mockVideoDraft);
    expect(upsertMock).toHaveBeenCalledTimes(3);
    expect(createHashtagMock).toHaveBeenCalledTimes(3);
    
    // Verify positions
    expect(createHashtagMock).toHaveBeenNthCalledWith(1, {
      data: {
        videoId: mockVideoDraft.id,
        hashtagId: mockHashtag1.id,
        position: 0,
      },
    });
    expect(createHashtagMock).toHaveBeenNthCalledWith(3, {
      data: {
        videoId: mockVideoDraft.id,
        hashtagId: mockHashtag3.id,
        position: 2,
      },
    });
  });

  it('should create video with postDate', async () => {
    const postDate = new Date('2026-01-27');
    const input = {
      title: 'Published Video',
      script: 'Script',
      description: 'Description',
      videoLengthSeconds: 45,
      postDate,
      status: VideoStatus.PUBLISHED,
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          create: vi.fn().mockResolvedValue({ ...mockVideoDraft, postDate, status: VideoStatus.PUBLISHED }),
        },
        hashtag: { upsert: vi.fn() },
        videoHashtag: { create: vi.fn() },
      };
      return callback(tx);
    });

    const result = await createVideo(input);

    expect(result.postDate).toEqual(postDate);
    expect(result.status).toBe(VideoStatus.PUBLISHED);
  });

  it('should reject invalid input', async () => {
    const input = {
      title: '', // empty title
      script: 'Script',
      description: 'Description',
      videoLengthSeconds: 30,
    };

    await expect(createVideo(input)).rejects.toThrow();
  });

  it('should reject negative video length', async () => {
    const input = {
      title: 'Video',
      script: 'Script',
      description: 'Description',
      videoLengthSeconds: -10,
    };

    await expect(createVideo(input)).rejects.toThrow();
  });

  it('should handle empty hashtags array', async () => {
    const input = {
      title: 'Video',
      script: 'Script',
      description: 'Description',
      videoLengthSeconds: 30,
      hashtags: [],
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          create: vi.fn().mockResolvedValue(mockVideoDraft),
        },
        hashtag: {
          upsert: vi.fn(),
        },
        videoHashtag: {
          create: vi.fn(),
        },
      };
      return callback(tx);
    });

    const result = await createVideo(input);

    expect(result).toEqual(mockVideoDraft);
  });

  it('should convert hashtags to lowercase', async () => {
    const input = {
      title: 'Video',
      script: 'Script',
      description: 'Description',
      videoLengthSeconds: 30,
      hashtags: ['FYP', 'ViRaL'],
    };

    const upsertMock = vi.fn()
      .mockResolvedValueOnce({ id: 'h1', tag: 'fyp', createdAt: new Date() })
      .mockResolvedValueOnce({ id: 'h2', tag: 'viral', createdAt: new Date() });

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        video: {
          create: vi.fn().mockResolvedValue(mockVideoDraft),
        },
        hashtag: {
          upsert: upsertMock,
        },
        videoHashtag: {
          create: vi.fn(),
        },
      };
      return callback(tx);
    });

    await createVideo(input);

    expect(upsertMock).toHaveBeenCalledWith({
      where: { tag: 'fyp' },
      update: {},
      create: { tag: 'fyp' },
    });
    expect(upsertMock).toHaveBeenCalledWith({
      where: { tag: 'viral' },
      update: {},
      create: { tag: 'viral' },
    });
  });
});
