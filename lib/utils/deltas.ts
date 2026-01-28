/**
 * Delta calculation utilities for snapshot metrics
 * 
 * Calculates changes between consecutive snapshots to show "movement"
 * in video performance metrics.
 */

import type { SerializedSnapshot } from '@/lib/types/snapshot';

export interface MetricDelta {
  value: number;
  absolute: number; // absolute change (e.g., +123)
  percentage: number | null; // percentage change (e.g., +18.5)
  direction: 'up' | 'down' | 'neutral';
}

export interface SnapshotDeltas {
  views: MetricDelta | null;
  likes: MetricDelta | null;
  comments: MetricDelta | null;
  shares: MetricDelta | null;
  favorites: MetricDelta | null;
  newFollowers: MetricDelta | null;
  profileViews: MetricDelta | null;
  completionRate: MetricDelta | null;
  avgWatchTimeSeconds: MetricDelta | null;
}

/**
 * Calculate delta for a single metric
 */
function calculateMetricDelta(
  current: number | null | undefined,
  previous: number | null | undefined
): MetricDelta | null {
  // If either value is missing, can't calculate delta
  if (current == null || previous == null) {
    return null;
  }

  const absolute = current - previous;
  
  // Avoid division by zero for percentage
  const percentage = previous === 0 
    ? (current > 0 ? 100 : 0)
    : ((absolute / previous) * 100);

  let direction: 'up' | 'down' | 'neutral';
  if (absolute > 0) {
    direction = 'up';
  } else if (absolute < 0) {
    direction = 'down';
  } else {
    direction = 'neutral';
  }

  return {
    value: current,
    absolute,
    percentage,
    direction,
  };
}

/**
 * Calculate all deltas between current snapshot and previous snapshot
 * 
 * @param snapshots - Array of snapshots for a video, sorted by recordedAt (oldest first)
 * @param currentIndex - Index of the current snapshot (defaults to last)
 * @returns Deltas for all metrics, or null if no previous snapshot exists
 */
export function calculateSnapshotDeltas(
  snapshots: SerializedSnapshot[],
  currentIndex?: number
): SnapshotDeltas | null {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }

  const index = currentIndex ?? snapshots.length - 1;
  
  // Need at least 2 snapshots to calculate delta
  if (index === 0 || index >= snapshots.length) {
    return null;
  }

  const current = snapshots[index];
  const previous = snapshots[index - 1];

  return {
    views: calculateMetricDelta(current.views, previous.views),
    likes: calculateMetricDelta(current.likes, previous.likes),
    comments: calculateMetricDelta(current.comments, previous.comments),
    shares: calculateMetricDelta(current.shares, previous.shares),
    favorites: calculateMetricDelta(current.favorites, previous.favorites),
    newFollowers: calculateMetricDelta(current.newFollowers, previous.newFollowers),
    profileViews: calculateMetricDelta(current.profileViews, previous.profileViews),
    completionRate: calculateMetricDelta(
      typeof current.completionRate === 'number' ? current.completionRate : null,
      typeof previous.completionRate === 'number' ? previous.completionRate : null
    ),
    avgWatchTimeSeconds: calculateMetricDelta(
      typeof current.avgWatchTimeSeconds === 'number' ? current.avgWatchTimeSeconds : null,
      typeof previous.avgWatchTimeSeconds === 'number' ? previous.avgWatchTimeSeconds : null
    ),
  };
}

/**
 * Format a delta for display
 * 
 * @param delta - The metric delta
 * @param format - Display format ('absolute', 'percentage', or 'both')
 * @returns Formatted string like "+123 (+18%)" or "↓ 0.7%"
 */
export function formatDelta(
  delta: MetricDelta | null,
  format: 'absolute' | 'percentage' | 'both' = 'both'
): string {
  if (!delta) {
    return '—';
  }

  const arrow = delta.direction === 'up' ? '↑' : delta.direction === 'down' ? '↓' : '→';
  const sign = delta.absolute > 0 ? '+' : '';
  
  if (format === 'absolute') {
    return `${sign}${delta.absolute.toLocaleString()}`;
  }
  
  if (format === 'percentage') {
    if (delta.percentage === null) {
      return '—';
    }
    return `${arrow} ${Math.abs(delta.percentage).toFixed(1)}%`;
  }
  
  // 'both' format
  if (delta.percentage === null) {
    return `${sign}${delta.absolute.toLocaleString()}`;
  }
  
  return `${sign}${delta.absolute.toLocaleString()} (${sign}${delta.percentage.toFixed(1)}%)`;
}

/**
 * Get CSS classes for delta styling
 */
export function getDeltaClasses(delta: MetricDelta | null): string {
  if (!delta || delta.direction === 'neutral') {
    return 'text-gray-500 dark:text-gray-400';
  }
  
  if (delta.direction === 'up') {
    return 'text-emerald-600 dark:text-emerald-400';
  }
  
  return 'text-red-600 dark:text-red-400';
}

/**
 * Get the latest snapshot for a video
 */
export function getLatestSnapshot(
  snapshots: SerializedSnapshot[]
): SerializedSnapshot | null {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }
  
  return snapshots[snapshots.length - 1];
}

/**
 * Get deltas for the latest snapshot (comparing with previous)
 */
export function getLatestDeltas(
  snapshots: SerializedSnapshot[]
): SnapshotDeltas | null {
  return calculateSnapshotDeltas(snapshots);
}
