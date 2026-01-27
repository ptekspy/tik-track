import { z } from 'zod';

/**
 * Schema for hashtag validation
 * Ensures hashtags are lowercase, trimmed, and valid
 */
export const hashtagSchema = z
  .string()
  .min(1, 'Hashtag cannot be empty')
  .max(50, 'Hashtag must be less than 50 characters')
  .transform((val) => val.toLowerCase().trim())
  .pipe(z.string().regex(/^[a-z0-9_]+$/, 'Hashtag can only contain lowercase letters, numbers, and underscores'));

export type HashtagInput = z.infer<typeof hashtagSchema>;

/**
 * Schema for array of hashtags
 */
export const hashtagArraySchema = z.array(hashtagSchema).max(30, 'Maximum 30 hashtags allowed');

export type HashtagArrayInput = z.infer<typeof hashtagArraySchema>;
