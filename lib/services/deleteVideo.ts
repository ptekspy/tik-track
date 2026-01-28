import { findVideoById } from '@/lib/dal/videos';
import { db } from '@/lib/database/client';
import { requireUser } from '@/lib/auth/server';

/**
 * Delete a video and all its associated data
 * Cascade deletes: snapshots, videoHashtag relations
 * 
 * @param videoId - Video ID to delete
 * @throws Error if video not found or user not authorized
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  // Get authenticated user
  const user = await requireUser();
  
  // Check video exists and user owns it
  const video = await findVideoById(videoId, user.id);
  
  if (!video) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Delete video (cascade deletes snapshots and videoHashtag relations via schema)
  await db.video.delete({
    where: { id: videoId, userId: user.id },
  });
};
