import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteVideo } from './deleteVideo';
import { mockVideoPublished, mockUser } from '@/lib/testing/mocks';

// Mock auth
vi.mock('@/lib/auth/server', () => ({
  requireUser: vi.fn(),
}));

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    video: {
      delete: vi.fn(),
    },
  },
}));

// Mock the DAL functions
vi.mock('@/lib/dal/videos', () => ({
  findVideoById: vi.fn(),
}));

import { requireUser } from '@/lib/auth/server';
import { db } from '@/lib/database/client';
import { findVideoById } from '@/lib/dal/videos';

describe('deleteVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue(mockUser);
  });

  it('should delete an existing video', async () => {
    vi.mocked(findVideoById).mockResolvedValue(mockVideoPublished);
    vi.mocked(db.video.delete).mockResolvedValue(mockVideoPublished);

    await deleteVideo(mockVideoPublished.id);

    expect(findVideoById).toHaveBeenCalledWith(mockVideoPublished.id);
    expect(db.video.delete).toHaveBeenCalledWith({
      where: { id: mockVideoPublished.id },
    });
  });

  it('should throw error if video not found', async () => {
    vi.mocked(findVideoById).mockResolvedValue(null);

    await expect(deleteVideo('non-existent-id')).rejects.toThrow(
      'Video with ID non-existent-id not found'
    );

    expect(db.video.delete).not.toHaveBeenCalled();
  });
});
