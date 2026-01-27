import { z } from 'zod';
import { VideoStatus } from '@/lib/generated/client';

/**
 * Schema for creating a new video
 */
export const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  script: z.string().min(1, 'Script is required'),
  description: z.string().min(1, 'Description is required'),
  videoLengthSeconds: z.number().int().positive('Video length must be positive'),
  postDate: z.date().optional().nullable(),
  status: z.nativeEnum(VideoStatus).default(VideoStatus.DRAFT),
  hashtags: z.array(z.string().min(1).max(50)).optional().default([]),
});

export type CreateVideoInput = z.infer<typeof createVideoSchema>;

/**
 * Schema for updating a video
 */
export const updateVideoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  script: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  videoLengthSeconds: z.number().int().positive().optional(),
  postDate: z.date().optional().nullable(),
  hashtags: z.array(z.string().min(1).max(50)).optional(),
});

export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;

/**
 * Schema for updating video status with forward-only validation
 */
export const updateVideoStatusSchema = z.object({
  currentStatus: z.nativeEnum(VideoStatus),
  newStatus: z.nativeEnum(VideoStatus),
}).refine((data) => {
  const validTransitions: Record<VideoStatus, VideoStatus[]> = {
    [VideoStatus.DRAFT]: [VideoStatus.DRAFT, VideoStatus.PUBLISHED],
    [VideoStatus.PUBLISHED]: [VideoStatus.PUBLISHED, VideoStatus.ARCHIVED],
    [VideoStatus.ARCHIVED]: [VideoStatus.ARCHIVED],
  };
  
  return validTransitions[data.currentStatus].includes(data.newStatus);
}, {
  message: 'Invalid status transition. Status can only move forward: DRAFT → PUBLISHED → ARCHIVED',
});

export type UpdateVideoStatusInput = z.infer<typeof updateVideoStatusSchema>;
