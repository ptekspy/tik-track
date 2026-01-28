import { db } from '@/lib/database/client';
import type { AnalyticsSnapshot, SnapshotType, Prisma } from '@/lib/types/server';

/**
 * Find a snapshot by ID for a specific user
 */
export const findSnapshotById = async (id: string, userId: string): Promise<AnalyticsSnapshot | null> => {
  return db.analyticsSnapshot.findFirst({
    where: { id, userId },
  });
};

/**
 * Find all snapshots for a video owned by a specific user
 */
export const findSnapshotsByVideoId = async (videoId: string, userId: string): Promise<AnalyticsSnapshot[]> => {
  return db.analyticsSnapshot.findMany({
    where: { videoId, userId },
    orderBy: { recordedAt: 'asc' },
  });
};

/**
 * Find a specific snapshot by video ID and snapshot type for a specific user
 */
export const findSnapshotByVideoAndType = async (
  videoId: string,
  type: SnapshotType,
  userId: string
): Promise<AnalyticsSnapshot | null> => {
  return db.analyticsSnapshot.findFirst({
    where: {
      videoId,
      snapshotType: type,
      userId,
    },
  });
};

/**
 * Create a new snapshot
 */
export const createSnapshot = async (
  data: Omit<Prisma.AnalyticsSnapshotUncheckedCreateInput, 'user' | 'channel' | 'userId' | 'channelId'>,
  userId: string,
  channelId: string
): Promise<AnalyticsSnapshot> => {
  return db.analyticsSnapshot.create({
    data: {
      ...data,
      userId,
      channelId,
    },
  });
};

/**
 * Update a snapshot (only if owned by user)
 */
export const updateSnapshot = async (
  id: string,
  data: Prisma.AnalyticsSnapshotUpdateInput,
  userId: string
): Promise<AnalyticsSnapshot> => {
  return db.analyticsSnapshot.update({
    where: { id, userId },
    data,
  });
};

/**
 * Delete a snapshot (only if owned by user)
 */
export const deleteSnapshot = async (id: string, userId: string): Promise<AnalyticsSnapshot> => {
  return db.analyticsSnapshot.delete({
    where: { id, userId },
  });
};
