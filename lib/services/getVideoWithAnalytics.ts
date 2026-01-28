import { findVideoById } from '@/lib/dal/videos';
import { findSnapshotsByVideoId } from '@/lib/dal/snapshots';
import type { Video, AnalyticsSnapshot } from '@/lib/types/server';
import { Prisma } from '@/lib/types/server';
import type { VideoWithAll } from '@/lib/types/video';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';
import { calculateShareRate } from '@/lib/metrics/calculateShareRate';
import { calculateRetentionRate } from '@/lib/metrics/calculateRetentionRate';
import { calculateFollowerConversion } from '@/lib/metrics/calculateFollowerConversion';
import { detectSignals } from '@/lib/metrics/detectSignals';
import type { SnapshotWithMetrics } from '@/lib/types/metrics';
import { requireUser } from '@/lib/auth/server';

export interface VideoWithAnalytics extends Video {
  snapshots: SnapshotWithMetrics[];
}

/**
 * Get video with snapshots and calculated analytics
 * 
 * @param videoId - Video ID
 * @returns Video with snapshots enriched with calculated metrics
 * @throws Error if video not found or user not authorized
 */
export const getVideoWithAnalytics = async (videoId: string): Promise<VideoWithAnalytics> => {
  // Get authenticated user
  const user = await requireUser();
  
  // Fetch video (ensures user owns it)
  const video = await findVideoById(videoId, user.id);
  
  if (!video) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Fetch snapshots for this user's video
  const snapshots = await findSnapshotsByVideoId(videoId, user.id);

  // Calculate metrics for each snapshot
  const snapshotsWithMetrics: SnapshotWithMetrics[] = snapshots.map((snapshot) => {
    const engagementRate = calculateEngagementRate(snapshot);
    const shareRate = calculateShareRate(snapshot);
    const followerConversion = calculateFollowerConversion(snapshot);
    
    // Calculate retention rate using video length
    const completionRateNum = snapshot.completionRate 
      ? (snapshot.completionRate instanceof Prisma.Decimal 
          ? snapshot.completionRate.toNumber() 
          : snapshot.completionRate)
      : null;
    
    const avgWatchTimeNum = snapshot.avgWatchTimeSeconds
      ? (snapshot.avgWatchTimeSeconds instanceof Prisma.Decimal
          ? snapshot.avgWatchTimeSeconds.toNumber()
          : snapshot.avgWatchTimeSeconds)
      : null;
    
    const retentionRate = avgWatchTimeNum
      ? calculateRetentionRate(avgWatchTimeNum, video.videoLengthSeconds)
      : null;

    // Detect signal
    const signal = detectSignals({
      completionRate: completionRateNum,
      shareRate,
      followerConversion,
      engagementRate,
    });

    return {
      ...snapshot,
      engagementRate,
      shareRate,
      retentionRate,
      followerConversion,
      signal,
    };
  });

  return {
    ...video,
    snapshots: snapshotsWithMetrics,
  };
};
