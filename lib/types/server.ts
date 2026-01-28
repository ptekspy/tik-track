/**
 * Server-side only exports from Prisma
 * These can only be used in Server Components, Server Actions, and API routes
 */

export { PrismaClient, Prisma } from '@/lib/generated/client/client';
export { VideoStatus, SnapshotType } from '@/lib/generated/client/client';

export type {
  Video,
  AnalyticsSnapshot,
  Hashtag,
  VideoHashtag,
} from '@/lib/generated/client/client';
