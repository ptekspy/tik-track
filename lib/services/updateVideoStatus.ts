import { updateVideoStatusSchema } from '@/lib/schemas/video';
import { findVideoById, updateVideo as updateVideoDAL } from '@/lib/dal/videos';
import { VideoStatus, type Video } from '@/lib/types/server';
import { requireUser } from '@/lib/auth/server';

/**
 * Update video status with forward-only validation
 * Ensures status transitions follow: DRAFT → PUBLISHED → ARCHIVED
 * 
 * @param videoId - Video ID
 * @param newStatus - New status to transition to
 * @returns Updated video
 * @throws Error if video not found, user not authorized, or invalid transition
 */
export const updateVideoStatus = async (
  videoId: string,
  newStatus: VideoStatus
): Promise<Video> => {
  // Get authenticated user
  const user = await requireUser();
  
  // Fetch current video (ensures user owns it)
  const video = await findVideoById(videoId, user.id);
  
  if (!video) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Validate status transition
  updateVideoStatusSchema.parse({
    currentStatus: video.status,
    newStatus,
  });

  // Update video status
  return await updateVideoDAL(videoId, { status: newStatus }, user.id);
};
