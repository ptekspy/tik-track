import { findVideoById } from '@/lib/dal/videos';
import { db } from '@/lib/database/client';

/**
 * Delete a video and all its associated data
 * Cascade deletes: snapshots, videoHashtag relations
 * 
 * @param videoId - Video ID to delete
 * @throws Error if video not found
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  // Check video exists
  const video = await findVideoById(videoId);
  
  if (!video) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Delete video (cascade deletes snapshots and videoHashtag relations via schema)
  await db.video.delete({
    where: { id: videoId },
  });
};
