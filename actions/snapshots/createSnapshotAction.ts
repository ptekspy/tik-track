'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { createSnapshot } from '@/lib/snapshots/createSnapshot';
import type { SnapshotFormData } from '@/components/SnapshotForm/SnapshotForm';

export async function createSnapshotAction(videoId: string, data: SnapshotFormData) {
  try {
    const snapshot = await createSnapshot(db, videoId, {
      snapshotType: data.snapshotType,
      capturedAt: new Date(), // Use current time
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      saves: data.favorites || 0,
      followers: data.newFollowers || 0,
      averageWatchTime: data.avgWatchTimeSeconds || null,
      totalWatchTimeHours: data.totalPlayTimeSeconds ? Math.round(data.totalPlayTimeSeconds / 3600) : null,
      fullVideoWatchesPercentage: data.completionRate || null,
      reachedFollowersPercentage: null, // Not in form data
    });

    revalidatePath('/dashboard');
    revalidatePath(`/videos/${videoId}`);
    redirect(`/videos/${videoId}`);
  } catch (error) {
    console.error('Failed to create snapshot:', error);
    throw new Error('Failed to create snapshot');
  }
}
