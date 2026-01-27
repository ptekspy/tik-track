import { db } from '@/lib/database/client';
import { createVideoSchema } from '@/lib/schemas/video';
import type { CreateVideoInput } from '@/lib/schemas/video';
import type { Video } from '@/lib/generated/client';
import { findOrCreateHashtag, linkHashtagToVideo } from '@/lib/dal/hashtags';
import { createVideo as createVideoDAL } from '@/lib/dal/videos';

/**
 * Create a new video with hashtags
 * 
 * @param input - Video creation data (validated against schema)
 * @returns Created video
 * @throws ZodError if validation fails
 */
export const createVideo = async (input: unknown): Promise<Video> => {
  // Validate input
  const validated = createVideoSchema.parse(input) as CreateVideoInput;

  // Use transaction to create video and hashtags atomically
  return await db.$transaction(async (tx) => {
    // Create the video
    const video = await tx.video.create({
      data: {
        title: validated.title,
        script: validated.script,
        description: validated.description,
        videoLengthSeconds: validated.videoLengthSeconds,
        postDate: validated.postDate ?? null,
        status: validated.status,
      },
    });

    // Create and link hashtags if provided
    if (validated.hashtags && validated.hashtags.length > 0) {
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
            videoId: video.id,
            hashtagId: hashtag.id,
            position: i,
          },
        });
      }
    }

    return video;
  });
};
