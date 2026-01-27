import { db } from '@/lib/database/client';
import type { Video, VideoStatus } from '@/lib/generated/client';
import type { Prisma } from '@/lib/generated/client';

/**
 * Find a video by ID
 */
export const findVideoById = async (id: string): Promise<Video | null> => {
  return db.video.findUnique({
    where: { id },
  });
};

/**
 * Find all videos
 */
export const findAllVideos = async (): Promise<Video[]> => {
  return db.video.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Find videos by status
 */
export const findVideosByStatus = async (status: VideoStatus): Promise<Video[]> => {
  return db.video.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Create a new video
 */
export const createVideo = async (data: Prisma.VideoCreateInput): Promise<Video> => {
  return db.video.create({
    data,
  });
};

/**
 * Update a video
 */
export const updateVideo = async (
  id: string,
  data: Prisma.VideoUpdateInput
): Promise<Video> => {
  return db.video.update({
    where: { id },
    data,
  });
};

/**
 * Delete a video
 */
export const deleteVideo = async (id: string): Promise<Video> => {
  return db.video.delete({
    where: { id },
  });
};
