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
} from '@/lib/generated/client';

// Export types
export type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
  Prisma,
};

// Export enum types as string literal unions (safe for client components)
// These match the Prisma enum values exactly but don't require runtime imports
export type VideoStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type SnapshotType = 
  | 'ONE_HOUR'
  | 'THREE_HOUR'
  | 'SIX_HOUR'
  | 'TWELVE_HOUR'
  | 'ONE_DAY'
  | 'TWO_DAY'
  | 'SEVEN_DAY'
  | 'FOURTEEN_DAY'
  | 'THIRTY_DAY';

