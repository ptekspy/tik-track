import type { Prisma, AnalyticsSnapshot } from '@/lib/generated/client/client';

export type { AnalyticsSnapshot };

// Client-safe snapshot type with serialized Decimal fields  
// Can also accept AnalyticsSnapshot for testing purposes
export type SerializedSnapshot = Omit<AnalyticsSnapshot, 'avgWatchTimeSeconds' | 'completionRate'> & {
  avgWatchTimeSeconds: number | Prisma.Decimal | null;
  completionRate: number | Prisma.Decimal | null;
};

// Snapshot with video included
export type SnapshotWithVideo = Prisma.AnalyticsSnapshotGetPayload<{
  include: {
    video: true;
  };
}>;

// Re-export SnapshotType enum from Prisma
export { SnapshotType } from '@/lib/generated/client/client';
