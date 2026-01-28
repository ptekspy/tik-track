import { createSnapshotSchema } from '@/lib/schemas/snapshot';
import type { CreateSnapshotInput } from '@/lib/schemas/snapshot';
import { findVideoById } from '@/lib/dal/videos';
import { findSnapshotByVideoAndType, createSnapshot as createSnapshotDAL } from '@/lib/dal/snapshots';
import { VideoStatus, SnapshotType } from '@/lib/types/server';
import type { AnalyticsSnapshot } from '@/lib/types/server';

/**
 * Create a new analytics snapshot for a published video
 * 
 * @param input - Snapshot creation data (validated against schema)
 * @returns Created snapshot
 * @throws Error if video not found, not published, or snapshot type already exists
 * @throws ZodError if validation fails
 */
export const createSnapshot = async (input: unknown): Promise<AnalyticsSnapshot> => {
  // Validate input
  const validated = createSnapshotSchema.parse(input) as CreateSnapshotInput;

  // Check video exists
  const video = await findVideoById(validated.videoId);
  
  if (!video) {
    throw new Error(`Video with ID ${validated.videoId} not found`);
  }

  // Check video is published
  if (video.status !== VideoStatus.PUBLISHED) {
    throw new Error('Snapshots can only be created for published videos');
  }

  // Check snapshot type doesn't already exist for this video
  const existingSnapshot = await findSnapshotByVideoAndType(
    validated.videoId,
    validated.snapshotType
  );

  if (existingSnapshot) {
    throw new Error(
      `Snapshot of type ${validated.snapshotType} already exists for this video`
    );
  }

  // Create snapshot
  return await createSnapshotDAL({
    video: { connect: { id: validated.videoId } },
    snapshotType: validated.snapshotType,
    views: validated.views ?? null,
    totalPlayTimeSeconds: validated.totalPlayTimeSeconds ?? null,
    avgWatchTimeSeconds: validated.avgWatchTimeSeconds ?? null,
    completionRate: validated.completionRate ?? null,
    newFollowers: validated.newFollowers ?? null,
    likes: validated.likes ?? null,
    comments: validated.comments ?? null,
    shares: validated.shares ?? null,
    favorites: validated.favorites ?? null,
    profileViews: validated.profileViews ?? null,
    reach: validated.reach ?? null,
  });
};
