import { db } from '@/lib/database/client';
import { createVideoSchema } from '@/lib/schemas/video';
import type { CreateVideoInput } from '@/lib/schemas/video';
import type { Video } from '@/lib/types/server';
import { findOrCreateHashtag, linkHashtagToVideo } from '@/lib/dal/hashtags';
import { findDefaultChannel } from '@/lib/dal/channels';
import { requireUser } from '@/lib/auth/server';

/**
 * Create a new video with hashtags
 * 
 * @param input - Video creation data (validated against schema)
 * @param channelId - Channel ID (optional, defaults to user's default channel)
 * @returns Created video
 * @throws ZodError if validation fails
 * @throws Error if user not authenticated or channel not found
 */
export const createVideo = async (input: unknown, channelId?: string): Promise<Video> => {
  // Get authenticated user
  const user = await requireUser();
  
  // If no channel specified, use default channel
  let actualChannelId = channelId;
  if (!actualChannelId) {
    const defaultChannel = await findDefaultChannel(user.id);
    if (!defaultChannel) {
      throw new Error('No default channel found. Please create a channel first.');
    }
    actualChannelId = defaultChannel.id;
  }
  
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
        userId: user.id,
        channelId: actualChannelId,
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
