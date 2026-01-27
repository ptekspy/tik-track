import { describe, it, expect } from 'vitest';
import { calculateEngagementRate } from './calculateEngagementRate';
import { mockSnapshotOneHour, mockSnapshotMinimal } from '@/lib/testing/mocks';

describe('calculateEngagementRate', () => {
  it('should calculate engagement rate correctly', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      likes: 100,
      comments: 50,
      shares: 25,
    };

    const result = calculateEngagementRate(snapshot);

    // (100 + 50 + 25) / 1000 * 100 = 17.5%
    expect(result).toBe(17.5);
  });

  it('should return null if views is 0', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 0,
      likes: 100,
      comments: 50,
      shares: 25,
    };

    const result = calculateEngagementRate(snapshot);

    expect(result).toBeNull();
  });

  it('should return null if views is null', () => {
    const snapshot = {
      ...mockSnapshotMinimal,
      views: null,
    };

    const result = calculateEngagementRate(snapshot);

    expect(result).toBeNull();
  });

  it('should treat null metrics as 0', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      likes: null,
      comments: null,
      shares: null,
    };

    const result = calculateEngagementRate(snapshot);

    expect(result).toBe(0);
  });

  it('should handle partial metrics', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      likes: 100,
      comments: null,
      shares: null,
    };

    const result = calculateEngagementRate(snapshot);

    // 100 / 1000 * 100 = 10%
    expect(result).toBe(10);
  });

  it('should calculate correctly with high engagement', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 100,
      likes: 50,
      comments: 30,
      shares: 20,
    };

    const result = calculateEngagementRate(snapshot);

    // (50 + 30 + 20) / 100 * 100 = 100%
    expect(result).toBe(100);
  });
});
