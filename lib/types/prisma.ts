/**
 * Re-export Prisma types for use throughout the application
 * Uses explicit exports to avoid Turbopack warnings and type-only imports for client components
 */

// Type-only imports to avoid bundling Prisma runtime
import type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
  Prisma,
  VideoStatus,
  SnapshotType
} from '@/lib/generated/client/client';

// Export types
export type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
  Prisma,
  VideoStatus,
  SnapshotType
};

