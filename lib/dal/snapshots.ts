import { db } from '@/lib/database/client';
import type { AnalyticsSnapshot, SnapshotType, Prisma } from '@/lib/types/server';

/**
 * Find a snapshot by ID
 */
export const findSnapshotById = async (id: string): Promise<AnalyticsSnapshot | null> => {
  return db.analyticsSnapshot.findUnique({
    where: { id },
  });
};

/**
 * Find all snapshots for a video
 */
export const findSnapshotsByVideoId = async (videoId: string): Promise<AnalyticsSnapshot[]> => {
  return db.analyticsSnapshot.findMany({
    where: { videoId },
    orderBy: { recordedAt: 'asc' },
  });
};

/**
 * Find a specific snapshot by video ID and snapshot type
 */
export const findSnapshotByVideoAndType = async (
  videoId: string,
  type: SnapshotType
): Promise<AnalyticsSnapshot | null> => {
  return db.analyticsSnapshot.findUnique({
    where: {
      videoId_snapshotType: {
        videoId,
        snapshotType: type,
      },
    },
  });
};

/**
 * Create a new snapshot
 */
export const createSnapshot = async (
  data: Prisma.AnalyticsSnapshotCreateInput
): Promise<AnalyticsSnapshot> => {
  return db.analyticsSnapshot.create({
    data,
  });
};

/**
 * Update a snapshot
 */
export const updateSnapshot = async (
  id: string,
  data: Prisma.AnalyticsSnapshotUpdateInput
): Promise<AnalyticsSnapshot> => {
  return db.analyticsSnapshot.update({
    where: { id },
    data,
  });
};

/**
 * Delete a snapshot
 */
export const deleteSnapshot = async (id: string): Promise<AnalyticsSnapshot> => {
  return db.analyticsSnapshot.delete({
    where: { id },
  });
};
