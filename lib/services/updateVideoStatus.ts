import { updateVideoStatusSchema } from '@/lib/schemas/video';
import { findVideoById, updateVideo as updateVideoDAL } from '@/lib/dal/videos';
import { VideoStatus, type Video } from '@/lib/types/server';

/**
 * Update video status with forward-only validation
 * Ensures status transitions follow: DRAFT → PUBLISHED → ARCHIVED
 * 
 * @param videoId - Video ID
 * @param newStatus - New status to transition to
 * @returns Updated video
 * @throws Error if video not found or invalid transition
 */
export const updateVideoStatus = async (
  videoId: string,
  newStatus: VideoStatus
): Promise<Video> => {
  // Fetch current video
  const video = await findVideoById(videoId);
  
  if (!video) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Validate status transition
  updateVideoStatusSchema.parse({
    currentStatus: video.status,
    newStatus,
  });

  // Update video status
  return await updateVideoDAL(videoId, { status: newStatus });
};
