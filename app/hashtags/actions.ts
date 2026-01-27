'use server';

import { revalidatePath } from 'next/cache';
import { mergeHashtags } from '@/lib/services/mergeHashtags';

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Merge two hashtags (move all videos from source to target, delete source)
 */
export async function mergeHashtagsAction(
  sourceTag: string,
  targetTag: string
): Promise<ActionResult> {
  try {
    const result = await mergeHashtags(sourceTag, targetTag);
    
    // Revalidate hashtag pages
    revalidatePath('/hashtags');
    revalidatePath(`/hashtags/${sourceTag}`);
    revalidatePath(`/hashtags/${targetTag}`);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to merge hashtags',
    };
  }
}
