'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { updateVideo } from '@/lib/videos/updateVideo';
import type { VideoFormData } from '@/components/VideoForm/VideoForm';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function updateVideoAction(id: string, data: VideoFormData) {
  try {
    const video = await updateVideo(db, id, {
      title: data.title,
      script: data.script,
      description: data.description,
      videoLengthSeconds: data.videoLengthSeconds,
      status: data.status,
      postDate: data.postDate ? new Date(data.postDate) : undefined,
      hashtags: data.hashtags || [],
    });

    revalidatePath('/dashboard');
    revalidatePath('/videos');
    revalidatePath(`/videos/${id}`);
    redirect(`/videos/${video.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('Failed to update video:', error);
    throw new Error('Failed to update video');
  }
}
