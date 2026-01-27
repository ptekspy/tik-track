'use server';

import { revalidatePath } from 'next/cache';
import { createSnapshot } from '@/lib/services/createSnapshot';
import { deleteSnapshot } from '@/lib/services/deleteSnapshot';

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Create a new analytics snapshot for a video
 */
export async function createSnapshotAction(data: unknown): Promise<ActionResult> {
  try {
    const snapshot = await createSnapshot(data);
    
    // Revalidate the video page to show the new snapshot
    revalidatePath(`/videos/${snapshot.videoId}`);
    revalidatePath('/dashboard');
    
    return {
      success: true,
      data: snapshot,
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
      error: 'Failed to create snapshot',
    };
  }
}

/**
 * Delete an analytics snapshot
 */
export async function deleteSnapshotAction(
  snapshotId: string,
  videoId: string
): Promise<ActionResult> {
  try {
    await deleteSnapshot(snapshotId);
    
    // Revalidate the video page to reflect the deletion
    revalidatePath(`/videos/${videoId}`);
    revalidatePath('/dashboard');
    
    return {
      success: true,
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
      error: 'Failed to delete snapshot',
    };
  }
}
