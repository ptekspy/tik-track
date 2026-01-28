import type { AnalyticsSnapshot } from '@/lib/types/server';

/**
 * Calculate engagement rate for a snapshot
 * Formula: (likes + comments + shares) / views × 100
 * 
 * @param snapshot - Analytics snapshot data
 * @returns Engagement rate as a percentage, or null if views is 0/null or required metrics are missing
 */
export const calculateEngagementRate = (snapshot: AnalyticsSnapshot): number | null => {
  const { views, likes, comments, shares } = snapshot;

  if (!views || views === 0) {
    return null;
  }

  const likesCount = likes ?? 0;
  const commentsCount = comments ?? 0;
  const sharesCount = shares ?? 0;

  const totalEngagements = likesCount + commentsCount + sharesCount;
  
  return (totalEngagements / views) * 100;
};
