import type { AnalyticsSnapshot } from '@/lib/types/server';

/**
 * Calculate share rate for a snapshot
 * Formula: shares / views × 100
 * 
 * @param snapshot - Analytics snapshot data
 * @returns Share rate as a percentage, or null if views is 0/null or shares is missing
 */
export const calculateShareRate = (snapshot: AnalyticsSnapshot): number | null => {
  const { views, shares } = snapshot;

  if (!views || views === 0) {
    return null;
  }

  if (!shares) {
    return 0;
  }

  return (shares / views) * 100;
};
