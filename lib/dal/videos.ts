import { db } from '@/lib/database/client';
import type { Video, VideoStatus, Prisma } from '@/lib/types/server';

/**
 * Find a video by ID for a specific user
 */
export const findVideoById = async (id: string, userId: string): Promise<Video | null> => {
  return db.video.findUnique({
    where: { id, userId },
  });
};

/**
 * Find all videos for a specific user
 */
export const findAllVideos = async (userId: string): Promise<Video[]> => {
  return db.video.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Find videos by status for a specific user
 */
export const findVideosByStatus = async (status: VideoStatus, userId: string): Promise<Video[]> => {
  return db.video.findMany({
    where: { status, userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Create a new video
 */
export const createVideo = async (data: Prisma.VideoCreateInput, userId: string): Promise<Video> => {
  return db.video.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
};

/**
 * Update a video (only if owned by user)
 */
export const updateVideo = async (
  id: string,
  data: Prisma.VideoUpdateInput,
  userId: string
): Promise<Video> => {
  return db.video.update({
    where: { id, userId },
    data,
  });
};

/**
 * Delete a video (only if owned by user)
 */
export const deleteVideo = async (id: string, userId: string): Promise<Video> => {
  return db.video.delete({
    where: { id, userId },
  });
};
