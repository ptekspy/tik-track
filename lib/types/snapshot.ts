import type { Prisma, AnalyticsSnapshot } from '@/lib/generated/client/client';

export type { AnalyticsSnapshot };

// Snapshot with video included
export type SnapshotWithVideo = Prisma.AnalyticsSnapshotGetPayload<{
  include: {
    video: true;
  };
}>;

// Re-export SnapshotType enum from Prisma
export { SnapshotType } from '@/lib/generated/client/client';
