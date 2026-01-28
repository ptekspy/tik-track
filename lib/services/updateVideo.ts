import { db } from '@/lib/database/client';
import { updateVideoSchema } from '@/lib/schemas/video';
import type { UpdateVideoInput } from '@/lib/schemas/video';
import type { Video } from '@/lib/types/server';
import { findVideoById, updateVideo as updateVideoDAL } from '@/lib/dal/videos';
import { requireUser } from '@/lib/auth/server';

/**
 * Update video metadata and hashtags
 * 
 * @param videoId - Video ID
 * @param input - Video update data (validated against schema)
 * @returns Updated video
 * @throws Error if video not found or user not authorized
 * @throws ZodError if validation fails
 */
export const updateVideo = async (videoId: string, input: unknown): Promise<Video> => {
  // Get authenticated user
  const user = await requireUser();
  
  // Validate input
  const validated = updateVideoSchema.parse(input) as UpdateVideoInput;

  // Check video exists and user owns it
  const existingVideo = await findVideoById(videoId, user.id);
  if (!existingVideo) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Use transaction for atomic updates
  return await db.$transaction(async (tx) => {
    // Update video metadata
    const video = await tx.video.update({
      where: { id: videoId, userId: user.id },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.script && { script: validated.script }),
        ...(validated.description && { description: validated.description }),
        ...(validated.videoLengthSeconds && { videoLengthSeconds: validated.videoLengthSeconds }),
        ...(validated.postDate !== undefined && { postDate: validated.postDate }),
      },
    });

    // Handle hashtag updates if provided
    if (validated.hashtags !== undefined) {
      // Delete all existing hashtag links
      await tx.videoHashtag.deleteMany({
        where: { videoId },
      });

      // Create new hashtag links
      if (validated.hashtags.length > 0) {
        for (let i = 0; i < validated.hashtags.length; i++) {
          const tag = validated.hashtags[i];
          
          // Find or create the hashtag
          const hashtag = await tx.hashtag.upsert({
            where: { tag: tag.toLowerCase() },
            update: {},
            create: { tag: tag.toLowerCase() },
          });

          // Link hashtag to video with position
          await tx.videoHashtag.create({
            data: {
              videoId,
              hashtagId: hashtag.id,
              position: i,
            },
          });
        }
      }
    }

    return video;
  });
};
