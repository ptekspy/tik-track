/**
 * Service: Get All Hashtags with Statistics
 * 
 * Returns all hashtags with usage counts and aggregated metrics.
 * Useful for displaying hashtag performance dashboard.
 */

import { db } from '@/lib/database/client';
import { VideoStatus } from '@/lib/generated/client';

export interface HashtagWithStats {
  tag: string;
  videoCount: number;
  publishedVideoCount: number;
  totalViews: number;
  avgEngagementRate: number | null;
  lastUsed: Date;
}

/**
 * Get all hashtags with their statistics
 */
export const getAllHashtagsWithStats = async (): Promise<HashtagWithStats[]> => {
  // Fetch all hashtags with their video relationships
  const hashtags = await db.hashtag.findMany({
    include: {
      videos: {
        include: {
          video: {
            include: {
              snapshots: {
                orderBy: {
                  recordedAt: 'desc',
                },
                take: 1, // Latest snapshot only
              },
            },
          },
        },
      },
    },
    orderBy: {
      tag: 'asc',
    },
  });

  return hashtags.map((hashtag) => {
    const allVideos = hashtag.videos.map((vh) => vh.video);
    const publishedVideos = allVideos.filter((v) => v.status === VideoStatus.PUBLISHED);

    let totalViews = 0;
    let sumEngagementRate = 0;
    let engagementCount = 0;
    let lastUsed = new Date(0); // Epoch

    // Track most recent video using this hashtag (from all videos, not just published)
    for (const video of allVideos) {
      if (video.createdAt > lastUsed) {
        lastUsed = video.createdAt;
      }
    }

    // Calculate metrics from published videos only
    for (const video of publishedVideos) {
      const snapshot = video.snapshots[0];

      if (snapshot && snapshot.views) {
        totalViews += snapshot.views;

        // Calculate engagement rate
        if (snapshot.likes !== null && snapshot.comments !== null && snapshot.shares !== null) {
          const engagementRate = ((snapshot.likes + snapshot.comments + snapshot.shares) / snapshot.views) * 100;
          sumEngagementRate += engagementRate;
          engagementCount++;
        }
      }
    }

    return {
      tag: hashtag.tag,
      videoCount: allVideos.length,
      publishedVideoCount: publishedVideos.length,
      totalViews,
      avgEngagementRate: engagementCount > 0 ? sumEngagementRate / engagementCount : null,
      lastUsed,
    };
  });
};
