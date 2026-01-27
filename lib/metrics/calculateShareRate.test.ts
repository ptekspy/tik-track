import { describe, it, expect } from 'vitest';
import { calculateShareRate } from './calculateShareRate';
import { mockSnapshotOneHour, mockSnapshotMinimal } from '@/lib/testing/mocks';

describe('calculateShareRate', () => {
  it('should calculate share rate correctly', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      shares: 50,
    };

    const result = calculateShareRate(snapshot);

    // 50 / 1000 * 100 = 5%
    expect(result).toBe(5);
  });

  it('should return null if views is 0', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 0,
      shares: 50,
    };

    const result = calculateShareRate(snapshot);

    expect(result).toBeNull();
  });

  it('should return null if views is null', () => {
    const snapshot = {
      ...mockSnapshotMinimal,
      views: null,
      shares: 50,
    };

    const result = calculateShareRate(snapshot);

    expect(result).toBeNull();
  });

  it('should return 0 if shares is null', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 1000,
      shares: null,
    };

    const result = calculateShareRate(snapshot);

    expect(result).toBe(0);
  });

  it('should calculate correctly with high share rate', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 100,
      shares: 10,
    };

    const result = calculateShareRate(snapshot);

    // 10 / 100 * 100 = 10%
    expect(result).toBe(10);
  });

  it('should calculate correctly with low share rate', () => {
    const snapshot = {
      ...mockSnapshotOneHour,
      views: 10000,
      shares: 5,
    };

    const result = calculateShareRate(snapshot);

    // 5 / 10000 * 100 = 0.05%
    expect(result).toBe(0.05);
  });
});
