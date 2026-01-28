import { findVideoById } from '@/lib/dal/videos';
import { findSnapshotsByVideoId } from '@/lib/dal/snapshots';
import type { Video, AnalyticsSnapshot, Prisma } from '@/lib/types/server';
import type { VideoWithAll } from '@/lib/types/video';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';
import { calculateShareRate } from '@/lib/metrics/calculateShareRate';
import { calculateRetentionRate } from '@/lib/metrics/calculateRetentionRate';
import { calculateFollowerConversion } from '@/lib/metrics/calculateFollowerConversion';
import { detectSignals } from '@/lib/metrics/detectSignals';
import type { SnapshotWithMetrics } from '@/lib/types/metrics';

export interface VideoWithAnalytics extends Video {
  snapshots: SnapshotWithMetrics[];
}

/**
 * Get video with snapshots and calculated analytics
 * 
 * @param videoId - Video ID
 * @returns Video with snapshots enriched with calculated metrics
 * @throws Error if video not found
 */
export const getVideoWithAnalytics = async (videoId: string): Promise<VideoWithAnalytics> => {
  // Fetch video
  const video = await findVideoById(videoId);
  
  if (!video) {
    throw new Error(`Video with ID ${videoId} not found`);
  }

  // Fetch snapshots
  const snapshots = await findSnapshotsByVideoId(videoId);

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
    
    const retentionRate = snapshot.avgWatchTimeSeconds
      ? calculateRetentionRate(snapshot.avgWatchTimeSeconds, video.videoLengthSeconds)
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
