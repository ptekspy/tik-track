import type { AnalyticsSnapshot } from '@/lib/generated/client/client';

// Calculated engagement metrics
export type EngagementMetrics = {
  engagementRate: number | null;
  shareRate: number | null;
  followerConversion: number | null;
  retentionRate: number | null;
};

// Signal detection result
export type SignalResult = 'positive' | 'negative' | 'neutral';

// Calculated metrics for a snapshot
export type CalculatedMetrics = EngagementMetrics & {
  signal: SignalResult;
};

// Snapshot with calculated metrics
export type SnapshotWithMetrics = AnalyticsSnapshot & CalculatedMetrics;
