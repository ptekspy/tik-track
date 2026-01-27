import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mergeHashtags } from './mergeHashtags';
import { mockHashtag1, mockHashtag2, mockVideoPublished } from '@/lib/testing/mocks';

// Mock the DAL and database
vi.mock('@/lib/dal/hashtags', () => ({
  findHashtagByTag: vi.fn(),
}));

vi.mock('@/lib/database/client', () => ({
  db: {
    $transaction: vi.fn(),
    videoHashtag: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    hashtag: {
      delete: vi.fn(),
    },
  },
}));

import { findHashtagByTag } from '@/lib/dal/hashtags';
import { db } from '@/lib/database/client';

describe('mergeHashtags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if source and target are the same', async () => {
    await expect(mergeHashtags('productivity', 'productivity')).rejects.toThrow(
      'Cannot merge a hashtag with itself'
    );
  });

  it('should throw error if source hashtag not found', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(null); // Source not found
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag2); // Target exists

    await expect(mergeHashtags('nonexistent', 'tips')).rejects.toThrow(
      'Source hashtag "nonexistent" not found'
    );
  });

  it('should throw error if target hashtag not found', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag1); // Source exists
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(null); // Target not found

    await expect(mergeHashtags('productivity', 'nonexistent')).rejects.toThrow(
      'Target hashtag "nonexistent" not found'
    );
  });

  it('should merge hashtags when video has only source', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag1); // Source
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag2); // Target

    const sourceRelation = {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag1.id,
      position: 0,
    };

    const mockTx = {
      videoHashtag: {
        findMany: vi.fn().mockResolvedValue([sourceRelation]),
        findUnique: vi.fn().mockResolvedValue(null), // No existing target relation
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
      hashtag: {
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    await mergeHashtags('productivity', 'tips');

    // Should update source relation to point to target
    expect(mockTx.videoHashtag.update).toHaveBeenCalledWith({
      where: {
        videoId_hashtagId: {
          videoId: mockVideoPublished.id,
          hashtagId: mockHashtag1.id,
        },
      },
      data: {
        hashtagId: mockHashtag2.id,
      },
    });

    // Should delete source hashtag
    expect(mockTx.hashtag.delete).toHaveBeenCalledWith({
      where: {
        id: mockHashtag1.id,
      },
    });
  });

  it('should delete source relation when video already has target', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag1); // Source
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag2); // Target

    const sourceRelation = {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag1.id,
      position: 0,
    };

    const existingTargetRelation = {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag2.id,
      position: 1,
    };

    const mockTx = {
      videoHashtag: {
        findMany: vi.fn().mockResolvedValue([sourceRelation]),
        findUnique: vi.fn().mockResolvedValue(existingTargetRelation), // Video already has target
        delete: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
      },
      hashtag: {
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    await mergeHashtags('productivity', 'tips');

    // Should delete source relation (not update, since target exists)
    expect(mockTx.videoHashtag.delete).toHaveBeenCalledWith({
      where: {
        videoId_hashtagId: {
          videoId: mockVideoPublished.id,
          hashtagId: mockHashtag1.id,
        },
      },
    });

    // Should NOT update
    expect(mockTx.videoHashtag.update).not.toHaveBeenCalled();

    // Should still delete source hashtag
    expect(mockTx.hashtag.delete).toHaveBeenCalledWith({
      where: {
        id: mockHashtag1.id,
      },
    });
  });

  it('should handle multiple videos with source hashtag', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag1);
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag2);

    const video1Id = '00000000-0000-4000-8000-000000000101';
    const video2Id = '00000000-0000-4000-8000-000000000102';

    const sourceRelations = [
      { videoId: video1Id, hashtagId: mockHashtag1.id, position: 0 },
      { videoId: video2Id, hashtagId: mockHashtag1.id, position: 0 },
    ];

    const mockTx = {
      videoHashtag: {
        findMany: vi.fn().mockResolvedValue(sourceRelations),
        findUnique: vi.fn().mockResolvedValue(null), // No conflicts
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
      hashtag: {
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    await mergeHashtags('productivity', 'tips');

    // Should update both relations
    expect(mockTx.videoHashtag.update).toHaveBeenCalledTimes(2);
    expect(mockTx.videoHashtag.delete).not.toHaveBeenCalled();
    expect(mockTx.hashtag.delete).toHaveBeenCalledOnce();
  });

  it('should normalize hashtag inputs (lowercase and trim)', async () => {
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag1);
    vi.mocked(findHashtagByTag).mockResolvedValueOnce(mockHashtag2);

    const mockTx = {
      videoHashtag: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      hashtag: {
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    vi.mocked(db.$transaction).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    await mergeHashtags('  PRODUCTIVITY  ', '  TIPS  ');

    expect(findHashtagByTag).toHaveBeenCalledWith('productivity');
    expect(findHashtagByTag).toHaveBeenCalledWith('tips');
  });
});
