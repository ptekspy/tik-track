import { describe, it, expect } from 'vitest';
import {
  calculateSnapshotDeltas,
  formatDelta,
  getDeltaClasses,
  getLatestSnapshot,
  getLatestDeltas,
  type MetricDelta,
} from './deltas';
import type { SerializedSnapshot } from '@/lib/types/snapshot';
import { SnapshotType } from '@/lib/constants';

describe('Delta Utilities', () => {
  const mockSnapshot1: SerializedSnapshot = {
    id: '1',
    videoId: 'video-1',
    recordedAt: new Date('2026-01-27T10:00:00Z'),
    snapshotType: SnapshotType.ONE_HOUR,
    views: 1000,
    likes: 100,
    comments: 50,
    shares: 25,
    favorites: 10,
    newFollowers: 5,
    profileViews: 200,
    completionRate: 0.65, // 65%
    avgWatchTimeSeconds: 30,
    totalPlayTimeSeconds: null,
    reach: null,
  };

  const mockSnapshot2: SerializedSnapshot = {
    id: '2',
    videoId: 'video-1',
    recordedAt: new Date('2026-01-27T16:00:00Z'),
    snapshotType: SnapshotType.SIX_HOUR,
    views: 1500, // +500 (+50%)
    likes: 180, // +80 (+80%)
    comments: 45, // -5 (-10%)
    shares: 25, // 0 (0%)
    favorites: 15,
    newFollowers: 8,
    profileViews: 250,
    completionRate: 0.68, // +0.03 (+4.6%)
    avgWatchTimeSeconds: 32, // +2 (+6.7%)
    totalPlayTimeSeconds: null,
    reach: null,
  };

  describe('calculateSnapshotDeltas', () => {
    it('should return null for empty array', () => {
      const result = calculateSnapshotDeltas([]);
      expect(result).toBeNull();
    });

    it('should return null for single snapshot', () => {
      const result = calculateSnapshotDeltas([mockSnapshot1]);
      expect(result).toBeNull();
    });

    it('should calculate deltas for second snapshot', () => {
      const result = calculateSnapshotDeltas([mockSnapshot1, mockSnapshot2]);
      
      expect(result).not.toBeNull();
      expect(result!.views).toEqual({
        value: 1500,
        absolute: 500,
        percentage: 50,
        direction: 'up',
      });
      
      expect(result!.likes).toEqual({
        value: 180,
        absolute: 80,
        percentage: 80,
        direction: 'up',
      });
      
      expect(result!.comments).toEqual({
        value: 45,
        absolute: -5,
        percentage: -10,
        direction: 'down',
      });
      
      expect(result!.shares).toEqual({
        value: 25,
        absolute: 0,
        percentage: 0,
        direction: 'neutral',
      });
    });

    it('should handle null values', () => {
      const snapshot1: SerializedSnapshot = {
        ...mockSnapshot1,
        favorites: null,
        newFollowers: null,
      };
      
      const snapshot2: SerializedSnapshot = {
        ...mockSnapshot2,
        favorites: 15,
        newFollowers: null,
      };
      
      const result = calculateSnapshotDeltas([snapshot1, snapshot2]);
      
      expect(result!.favorites).toBeNull(); // previous was null
      expect(result!.newFollowers).toBeNull(); // current is null
    });

    it('should handle percentage calculation when previous is 0', () => {
      const snapshot1: SerializedSnapshot = {
        ...mockSnapshot1,
        views: 0,
      };
      
      const snapshot2: SerializedSnapshot = {
        ...mockSnapshot2,
        views: 100,
      };
      
      const result = calculateSnapshotDeltas([snapshot1, snapshot2]);
      
      expect(result!.views).toEqual({
        value: 100,
        absolute: 100,
        percentage: 100,
        direction: 'up',
      });
    });

    it('should calculate deltas for specific index', () => {
      const snapshot3: SerializedSnapshot = {
        ...mockSnapshot2,
        id: '3',
        recordedAt: new Date('2026-01-28T10:00:00Z'),
        snapshotType: SnapshotType.ONE_DAY,
        views: 2000,
      };
      
      // Get deltas for snapshot2 (index 1) compared to snapshot1 (index 0)
      const result = calculateSnapshotDeltas([mockSnapshot1, mockSnapshot2, snapshot3], 1);
      
      expect(result!.views!.value).toBe(1500);
      expect(result!.views!.absolute).toBe(500);
    });
  });

  describe('formatDelta', () => {
    const positiveDelta: MetricDelta = {
      value: 1500,
      absolute: 500,
      percentage: 50,
      direction: 'up',
    };

    const negativeDelta: MetricDelta = {
      value: 45,
      absolute: -5,
      percentage: -10,
      direction: 'down',
    };

    const neutralDelta: MetricDelta = {
      value: 25,
      absolute: 0,
      percentage: 0,
      direction: 'neutral',
    };

    it('should format with both absolute and percentage', () => {
      expect(formatDelta(positiveDelta, 'both')).toBe('+500 (+50.0%)');
      expect(formatDelta(negativeDelta, 'both')).toBe('-5 (-10.0%)');
      expect(formatDelta(neutralDelta, 'both')).toBe('0 (0.0%)');
    });

    it('should format absolute only', () => {
      expect(formatDelta(positiveDelta, 'absolute')).toBe('+500');
      expect(formatDelta(negativeDelta, 'absolute')).toBe('-5');
      expect(formatDelta(neutralDelta, 'absolute')).toBe('0');
    });

    it('should format percentage only', () => {
      expect(formatDelta(positiveDelta, 'percentage')).toBe('↑ 50.0%');
      expect(formatDelta(negativeDelta, 'percentage')).toBe('↓ 10.0%');
      expect(formatDelta(neutralDelta, 'percentage')).toBe('→ 0.0%');
    });

    it('should return em dash for null delta', () => {
      expect(formatDelta(null)).toBe('—');
      expect(formatDelta(null, 'absolute')).toBe('—');
      expect(formatDelta(null, 'percentage')).toBe('—');
    });

    it('should handle null percentage', () => {
      const deltaWithoutPercentage: MetricDelta = {
        value: 100,
        absolute: 100,
        percentage: null,
        direction: 'up',
      };
      
      expect(formatDelta(deltaWithoutPercentage, 'both')).toBe('+100');
      expect(formatDelta(deltaWithoutPercentage, 'percentage')).toBe('—');
    });

    it('should use thousand separators', () => {
      const largeDelta: MetricDelta = {
        value: 11500,
        absolute: 10000,
        percentage: 666.67,
        direction: 'up',
      };
      
      expect(formatDelta(largeDelta, 'absolute')).toBe('+10,000');
    });
  });

  describe('getDeltaClasses', () => {
    it('should return green classes for positive delta', () => {
      const delta: MetricDelta = {
        value: 100,
        absolute: 50,
        percentage: 50,
        direction: 'up',
      };
      
      expect(getDeltaClasses(delta)).toBe('text-emerald-600 dark:text-emerald-400');
    });

    it('should return red classes for negative delta', () => {
      const delta: MetricDelta = {
        value: 50,
        absolute: -50,
        percentage: -50,
        direction: 'down',
      };
      
      expect(getDeltaClasses(delta)).toBe('text-red-600 dark:text-red-400');
    });

    it('should return gray classes for neutral delta', () => {
      const delta: MetricDelta = {
        value: 100,
        absolute: 0,
        percentage: 0,
        direction: 'neutral',
      };
      
      expect(getDeltaClasses(delta)).toBe('text-gray-500 dark:text-gray-400');
    });

    it('should return gray classes for null delta', () => {
      expect(getDeltaClasses(null)).toBe('text-gray-500 dark:text-gray-400');
    });
  });

  describe('getLatestSnapshot', () => {
    it('should return null for empty array', () => {
      expect(getLatestSnapshot([])).toBeNull();
    });

    it('should return the last snapshot', () => {
      const snapshot3: SerializedSnapshot = {
        ...mockSnapshot2,
        id: '3',
        recordedAt: new Date('2026-01-28T10:00:00Z'),
        snapshotType: SnapshotType.ONE_DAY,
      };
      
      const result = getLatestSnapshot([mockSnapshot1, mockSnapshot2, snapshot3]);
      expect(result).toBe(snapshot3);
    });
  });

  describe('getLatestDeltas', () => {
    it('should return deltas for latest snapshot', () => {
      const result = getLatestDeltas([mockSnapshot1, mockSnapshot2]);
      
      expect(result).not.toBeNull();
      expect(result!.views!.absolute).toBe(500);
    });

    it('should return null for single snapshot', () => {
      const result = getLatestDeltas([mockSnapshot1]);
      expect(result).toBeNull();
    });
  });
});
