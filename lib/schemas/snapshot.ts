import { z } from 'zod';
import { SnapshotType } from '@/lib/generated/client';
import { Prisma } from '@/lib/generated/client';

/**
 * Schema for creating a new analytics snapshot
 */
export const createSnapshotSchema = z.object({
  videoId: z.string().uuid('Invalid video ID'),
  snapshotType: z.nativeEnum(SnapshotType),
  views: z.number().int().nonnegative().optional().nullable(),
  totalPlayTimeSeconds: z.number().int().nonnegative().optional().nullable(),
  avgWatchTimeSeconds: z.number().int().nonnegative().optional().nullable(),
  completionRate: z.instanceof(Prisma.Decimal).or(z.number().nonnegative().max(100)).optional().nullable(),
  newFollowers: z.number().int().nonnegative().optional().nullable(),
  likes: z.number().int().nonnegative().optional().nullable(),
  comments: z.number().int().nonnegative().optional().nullable(),
  shares: z.number().int().nonnegative().optional().nullable(),
  favorites: z.number().int().nonnegative().optional().nullable(),
  profileViews: z.number().int().nonnegative().optional().nullable(),
  reach: z.number().int().nonnegative().optional().nullable(),
});

export type CreateSnapshotInput = z.infer<typeof createSnapshotSchema>;

/**
 * Schema for updating an analytics snapshot
 */
export const updateSnapshotSchema = z.object({
  views: z.number().int().nonnegative().optional().nullable(),
  totalPlayTimeSeconds: z.number().int().nonnegative().optional().nullable(),
  avgWatchTimeSeconds: z.number().int().nonnegative().optional().nullable(),
  completionRate: z.instanceof(Prisma.Decimal).or(z.number().nonnegative().max(100)).optional().nullable(),
  newFollowers: z.number().int().nonnegative().optional().nullable(),
  likes: z.number().int().nonnegative().optional().nullable(),
  comments: z.number().int().nonnegative().optional().nullable(),
  shares: z.number().int().nonnegative().optional().nullable(),
  favorites: z.number().int().nonnegative().optional().nullable(),
  profileViews: z.number().int().nonnegative().optional().nullable(),
  reach: z.number().int().nonnegative().optional().nullable(),
});

export type UpdateSnapshotInput = z.infer<typeof updateSnapshotSchema>;
