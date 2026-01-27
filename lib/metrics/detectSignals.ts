import type { SignalResult } from '@/lib/types/metrics';

export interface SignalMetrics {
  completionRate: number | null;
  shareRate: number | null;
  followerConversion: number | null;
  engagementRate: number | null;
}

/**
 * Detect positive/negative/neutral signals based on calculated metrics
 * 
 * Positive signals:
 * - Completion rate > 50%
 * - Share rate > 3%
 * - Follower conversion > 0.5%
 * 
 * Negative signals:
 * - Completion rate < 20%
 * - Engagement rate < 1%
 * 
 * @param metrics - Calculated metrics for a snapshot
 * @returns Signal type: 'positive', 'negative', or 'neutral'
 */
export const detectSignals = (metrics: SignalMetrics): SignalResult => {
  const { completionRate, shareRate, followerConversion, engagementRate } = metrics;

  // Check positive signals (any one triggers positive)
  if (completionRate !== null && completionRate > 50) {
    return 'positive';
  }

  if (shareRate !== null && shareRate > 3) {
    return 'positive';
  }

  if (followerConversion !== null && followerConversion > 0.5) {
    return 'positive';
  }

  // Check negative signals (any one triggers negative)
  if (completionRate !== null && completionRate < 20) {
    return 'negative';
  }

  if (engagementRate !== null && engagementRate < 1) {
    return 'negative';
  }

  // Default to neutral if no strong signals
  return 'neutral';
};
