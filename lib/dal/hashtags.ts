import { db } from '@/lib/database/client';
import type { Hashtag, VideoHashtag } from '@/lib/generated/client';
import type { Prisma } from '@/lib/generated/client';
import type { HashtagWithVideos } from '@/lib/types/hashtag';

/**
 * Find a hashtag by its tag
 */
export const findHashtagByTag = async (tag: string): Promise<Hashtag | null> => {
  return db.hashtag.findUnique({
    where: { tag: tag.toLowerCase() },
  });
};

/**
 * Find or create a hashtag (upsert)
 */
export const findOrCreateHashtag = async (tag: string): Promise<Hashtag> => {
  return db.hashtag.upsert({
    where: { tag: tag.toLowerCase() },
    update: {},
    create: { tag: tag.toLowerCase() },
  });
};

/**
 * Find all hashtags ordered by creation date
 */
export const findAllHashtags = async (): Promise<Hashtag[]> => {
  return db.hashtag.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Find a hashtag with its associated videos
 */
export const findHashtagWithVideos = async (tag: string): Promise<HashtagWithVideos | null> => {
  return db.hashtag.findUnique({
    where: { tag: tag.toLowerCase() },
    include: {
      videos: {
        include: {
          video: true,
        },
        orderBy: { position: 'asc' },
      },
    },
  }) as Promise<HashtagWithVideos | null>;
};

/**
 * Delete a hashtag
 */
export const deleteHashtag = async (id: string): Promise<Hashtag> => {
  return db.hashtag.delete({
    where: { id },
  });
};

/**
 * Link a hashtag to a video at a specific position
 */
export const linkHashtagToVideo = async (
  hashtagId: string,
  videoId: string,
  position: number
): Promise<VideoHashtag> => {
  return db.videoHashtag.create({
    data: {
      hashtagId,
      videoId,
      position,
    },
  });
};

/**
 * Unlink a hashtag from a video
 */
export const unlinkHashtagFromVideo = async (
  hashtagId: string,
  videoId: string
): Promise<VideoHashtag> => {
  return db.videoHashtag.delete({
    where: {
      videoId_hashtagId: {
        videoId,
        hashtagId,
      },
    },
  });
};

/**
 * Update hashtag positions for a video
 */
export const updateVideoHashtagPositions = async (
  videoId: string,
  hashtags: Array<{ hashtagId: string; position: number }>
): Promise<void> => {
  await db.$transaction(async (tx) => {
    // Delete all existing hashtags for the video
    await tx.videoHashtag.deleteMany({
      where: { videoId },
    });

    // Create new hashtag links with updated positions
    await tx.videoHashtag.createMany({
      data: hashtags.map(({ hashtagId, position }) => ({
        videoId,
        hashtagId,
        position,
      })),
    });
  });
};
