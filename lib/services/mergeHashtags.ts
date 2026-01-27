/**
 * Service: Merge Hashtags
 * 
 * Merges all videos from a source hashtag to a target hashtag, then deletes the source.
 * Uses a transaction to ensure atomicity.
 */

import { db } from '@/lib/database/client';
import { findHashtagByTag } from '@/lib/dal/hashtags';

/**
 * Merge source hashtag into target hashtag
 * All videos using source will be updated to use target, then source is deleted
 * 
 * @param sourceTag - The hashtag to merge from (will be deleted)
 * @param targetTag - The hashtag to merge into (will be kept)
 * @throws Error if either hashtag doesn't exist or if they're the same
 */
export const mergeHashtags = async (sourceTag: string, targetTag: string): Promise<void> => {
  const normalizedSource = sourceTag.toLowerCase().trim();
  const normalizedTarget = targetTag.toLowerCase().trim();

  if (normalizedSource === normalizedTarget) {
    throw new Error('Cannot merge a hashtag with itself');
  }

  // Find both hashtags
  const sourceHashtag = await findHashtagByTag(normalizedSource);
  const targetHashtag = await findHashtagByTag(normalizedTarget);

  if (!sourceHashtag) {
    throw new Error(`Source hashtag "${normalizedSource}" not found`);
  }

  if (!targetHashtag) {
    throw new Error(`Target hashtag "${normalizedTarget}" not found`);
  }

  // Use transaction to ensure atomicity
  await db.$transaction(async (tx) => {
    // Get all VideoHashtag entries for source
    const sourceVideoHashtags = await tx.videoHashtag.findMany({
      where: {
        hashtagId: sourceHashtag.id,
      },
    });

    // For each video using source hashtag
    for (const vh of sourceVideoHashtags) {
      // Check if video already has target hashtag
      const existingTarget = await tx.videoHashtag.findUnique({
        where: {
          videoId_hashtagId: {
            videoId: vh.videoId,
            hashtagId: targetHashtag.id,
          },
        },
      });

      if (existingTarget) {
        // Video already has target hashtag, just delete source relation
        await tx.videoHashtag.delete({
          where: {
            videoId_hashtagId: {
              videoId: vh.videoId,
              hashtagId: sourceHashtag.id,
            },
          },
        });
      } else {
        // Update source relation to point to target hashtag
        await tx.videoHashtag.update({
          where: {
            videoId_hashtagId: {
              videoId: vh.videoId,
              hashtagId: sourceHashtag.id,
            },
          },
          data: {
            hashtagId: targetHashtag.id,
          },
        });
      }
    }

    // Delete the source hashtag (all relations are now removed or transferred)
    await tx.hashtag.delete({
      where: {
        id: sourceHashtag.id,
      },
    });
  });
};
