/**
 * Server-side only exports from Prisma
 * These can only be used in Server Components, Server Actions, and API routes
 */

export { PrismaClient, Prisma } from '@/lib/generated/client/client';
export { VideoStatus, SnapshotType, UserRole } from '@/lib/generated/client/client';

export type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
  User,
  Session,
  Account,
  Verification,
  DismissedNotification,
} from '@/lib/generated/client/client';
