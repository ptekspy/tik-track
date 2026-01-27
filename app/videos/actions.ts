'use server';

import { revalidatePath } from 'next/cache';
import { createVideo } from '@/lib/services/createVideo';
import { updateVideo } from '@/lib/services/updateVideo';
import { updateVideoStatus } from '@/lib/services/updateVideoStatus';
import { deleteVideo } from '@/lib/services/deleteVideo';
import type { VideoStatus } from '@/lib/generated/client';

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Create a new video with optional first snapshot
 */
export async function createVideoAction(data: unknown): Promise<ActionResult> {
  try {
    const video = await createVideo(data);
    
    revalidatePath('/dashboard');
    revalidatePath('/videos');
    
    return {
      success: true,
      data: video,
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
      error: 'Failed to create video',
    };
  }
}

/**
 * Update an existing video
 */
export async function updateVideoAction(
  videoId: string,
  data: unknown
): Promise<ActionResult> {
  try {
    const video = await updateVideo(videoId, data);
    
    revalidatePath('/dashboard');
    revalidatePath('/videos');
    revalidatePath(`/videos/${videoId}`);
    
    return {
      success: true,
      data: video,
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
      error: 'Failed to update video',
    };
  }
}

/**
 * Update video status (DRAFT -> PUBLISHED -> ARCHIVED)
 */
export async function updateVideoStatusAction(
  videoId: string,
  newStatus: VideoStatus
): Promise<ActionResult> {
  try {
    const video = await updateVideoStatus(videoId, newStatus);
    
    revalidatePath('/dashboard');
    revalidatePath('/videos');
    revalidatePath(`/videos/${videoId}`);
    
    return {
      success: true,
      data: video,
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
      error: 'Failed to update video status',
    };
  }
}

/**
 * Delete a video and all associated snapshots
 */
export async function deleteVideoAction(videoId: string): Promise<ActionResult> {
  try {
    await deleteVideo(videoId);
    
    revalidatePath('/dashboard');
    revalidatePath('/videos');
    
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
      error: 'Failed to delete video',
    };
  }
}
