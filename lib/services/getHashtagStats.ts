/**
 * Service: Get Hashtag Statistics
 * 
 * Aggregates analytics metrics across all PUBLISHED videos using a specific hashtag.
 * Returns average metrics including engagement rate, views, and completion rate.
 */

import { findHashtagByTag } from '@/lib/dal/hashtags';
import { db } from '@/lib/database/client';
import { VideoStatus, type Video, type AnalyticsSnapshot } from '@/lib/generated/client';

export interface HashtagStats {
  tag: string;
  videoCount: number;
  totalViews: number;
  avgViews: number;
  avgEngagementRate: number | null;
  avgCompletionRate: number | null;
  avgShareRate: number | null;
}

/**
 * Get aggregated statistics for a hashtag across all published videos
 */
export const getHashtagStats = async (tag: string): Promise<HashtagStats | null> => {
  // Find the hashtag
  const hashtag = await findHashtagByTag(tag.toLowerCase().trim());
  
  if (!hashtag) {
    return null;
  }

  // Get all published videos with this hashtag and their latest snapshots
  const videos = await db.video.findMany({
    where: {
      status: VideoStatus.PUBLISHED,
      hashtags: {
        some: {
          hashtagId: hashtag.id,
        },
      },
    },
    include: {
      snapshots: {
        orderBy: {
          recordedAt: 'desc',
        },
        take: 1, // Only latest snapshot
      },
    },
  }) as Array<Video & { snapshots: AnalyticsSnapshot[] }>;

  const videoCount = videos.length;

  if (videoCount === 0) {
    return {
      tag: hashtag.tag,
      videoCount: 0,
      totalViews: 0,
      avgViews: 0,
      avgEngagementRate: null,
      avgCompletionRate: null,
      avgShareRate: null,
    };
  }

  // Calculate aggregates from latest snapshots
  let totalViews = 0;
  let sumEngagementRate = 0;
  let sumCompletionRate = 0;
  let sumShareRate = 0;
  let engagementCount = 0;
  let completionCount = 0;
  let shareCount = 0;

  for (const video of videos) {
    const snapshot = video.snapshots[0];
    
    if (snapshot && snapshot.views) {
      totalViews += snapshot.views;

      // Calculate engagement rate: (likes + comments + shares) / views * 100
      if (snapshot.likes !== null && snapshot.comments !== null && snapshot.shares !== null) {
        const engagementRate = ((snapshot.likes + snapshot.comments + snapshot.shares) / snapshot.views) * 100;
        sumEngagementRate += engagementRate;
        engagementCount++;
      }

      // Completion rate
      if (snapshot.completionRate !== null) {
        sumCompletionRate += Number(snapshot.completionRate) * 100; // Convert decimal to percentage
        completionCount++;
      }

      // Share rate: shares / views * 100
      if (snapshot.shares !== null) {
        const shareRate = (snapshot.shares / snapshot.views) * 100;
        sumShareRate += shareRate;
        shareCount++;
      }
    }
  }

  return {
    tag: hashtag.tag,
    videoCount,
    totalViews,
    avgViews: Math.round(totalViews / videoCount),
    avgEngagementRate: engagementCount > 0 ? sumEngagementRate / engagementCount : null,
    avgCompletionRate: completionCount > 0 ? sumCompletionRate / completionCount : null,
    avgShareRate: shareCount > 0 ? sumShareRate / shareCount : null,
  };
};
