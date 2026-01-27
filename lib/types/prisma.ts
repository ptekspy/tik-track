/**
 * Re-export Prisma types for use in client components
 * This file only exports types, not runtime code, so it's safe for client components
 */

// Type-only imports
import type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
  Prisma,
} from '@/lib/generated/client';

// Re-export types
export type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
  Prisma,
};

// Enums need to be redeclared to avoid importing runtime code
export enum VideoStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum SnapshotType {
  ONE_HOUR = 'ONE_HOUR',
  THREE_HOUR = 'THREE_HOUR',
  SIX_HOUR = 'SIX_HOUR',
  TWELVE_HOUR = 'TWELVE_HOUR',
  ONE_DAY = 'ONE_DAY',
  TWO_DAY = 'TWO_DAY',
  SEVEN_DAY = 'SEVEN_DAY',
  FOURTEEN_DAY = 'FOURTEEN_DAY',
  THIRTY_DAY = 'THIRTY_DAY',
}
