import { describe, it, expect } from 'vitest';
import { calculateFollowerConversion } from './calculateFollowerConversion';
import { mockSnapshotOneHour, mockSnapshotMinimal } from '@/lib/testing/mocks';

describe('calculateFollowerConversion', () => {
  it('should calculate follower conversion correctly', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      newFollowers: 10,
    };

    const result = calculateFollowerConversion(snapshot);

    // 10 / 1000 * 100 = 1%
    expect(result).toBe(1);
  });

  it('should return null if views is 0', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 0,
      newFollowers: 10,
    };

    const result = calculateFollowerConversion(snapshot);

    expect(result).toBeNull();
  });

  it('should return null if views is null', () => {
    const snapshot = {
      ...mockSnapshotMinimal,
      views: null,
      newFollowers: 10,
    };

    const result = calculateFollowerConversion(snapshot);

    expect(result).toBeNull();
  });

  it('should return 0 if newFollowers is null', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      newFollowers: null,
    };

    const result = calculateFollowerConversion(snapshot);

    expect(result).toBe(0);
  });

  it('should calculate correctly with high conversion', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 100,
      newFollowers: 5,
    };

    const result = calculateFollowerConversion(snapshot);

    // 5 / 100 * 100 = 5%
    expect(result).toBe(5);
  });

  it('should calculate correctly with low conversion', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 10000,
      newFollowers: 5,
    };

    const result = calculateFollowerConversion(snapshot);

    // 5 / 10000 * 100 = 0.05%
    expect(result).toBe(0.05);
  });

  it('should handle 0 new followers', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      newFollowers: 0,
    };

    const result = calculateFollowerConversion(snapshot);

    expect(result).toBe(0);
  });
});
