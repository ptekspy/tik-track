import type { PrismaClient, SnapshotType } from '@/lib/types/server';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreateSnapshotInput {
  snapshotType: SnapshotType;
  capturedAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  followers?: number;
  averageWatchTime?: number | null;
  totalWatchTimeHours?: number | null;
  fullVideoWatchesPercentage?: number | null;
  reachedFollowersPercentage?: number | null;
}

export async function createSnapshot(
  prisma: PrismaClient,
  videoId: string,
  input: CreateSnapshotInput
) {
  return await prisma.analyticsSnapshot.create({
    data: {
      videoId,
      recordedAt: input.capturedAt,
      snapshotType: input.snapshotType,
      views: input.views,
      likes: input.likes,
      comments: input.comments,
      shares: input.shares,
      favorites: input.saves ?? null,
      newFollowers: input.followers ?? null,
      avgWatchTimeSeconds: input.averageWatchTime ?? null,
      totalPlayTimeSeconds: input.totalWatchTimeHours ? input.totalWatchTimeHours * 3600 : null,
      completionRate: input.fullVideoWatchesPercentage ? new Decimal(input.fullVideoWatchesPercentage / 100) : null,
      profileViews: null,
      reach: null,
    },
  });
}
