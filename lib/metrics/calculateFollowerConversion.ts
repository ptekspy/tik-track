import type { AnalyticsSnapshot } from '@/lib/generated/client';

/**
 * Calculate follower conversion rate
 * Formula: newFollowers / views × 100
 * 
 * @param snapshot - Analytics snapshot data
 * @returns Follower conversion rate as a percentage, or null if views is 0/null or newFollowers is missing
 */
export const calculateFollowerConversion = (snapshot: AnalyticsSnapshot): number | null => {
  const { views, newFollowers } = snapshot;

  if (!views || views === 0) {
    return null;
  }

  if (!newFollowers) {
    return 0;
  }

  return (newFollowers / views) * 100;
};
