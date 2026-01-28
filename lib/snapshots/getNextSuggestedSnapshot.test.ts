import { describe, it, expect } from 'vitest';
import { SnapshotType } from '@/lib/generated/client/client';
import { getNextSuggestedSnapshot } from './getNextSuggestedSnapshot';
import { subHours, subDays } from 'date-fns';

describe('getNextSuggestedSnapshot', () => {
  it('should return null if all expected snapshots exist', () => {
    const postDate = subHours(new Date(), 3);
    const existingTypes = [SnapshotType.ONE_HOUR, SnapshotType.THREE_HOUR];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBeNull();
  });

  it('should return null for recently posted video', () => {
    const postDate = new Date();
    const existingTypes: SnapshotType[] = [];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBeNull();
  });

  it('should return ONE_HOUR if no snapshots exist after 1 hour', () => {
    const postDate = subHours(new Date(), 1);
    const existingTypes: SnapshotType[] = [];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBe(SnapshotType.ONE_HOUR);
  });

  it('should return THREE_HOUR if ONE_HOUR exists but THREE_HOUR is missing', () => {
    const postDate = subHours(new Date(), 3);
    const existingTypes = [SnapshotType.ONE_HOUR];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBe(SnapshotType.THREE_HOUR);
  });

  it('should return earliest missed snapshot in chronological order', () => {
    const postDate = subDays(new Date(), 7);
    const existingTypes = [
      SnapshotType.ONE_HOUR,
      SnapshotType.SIX_HOUR,
      SnapshotType.ONE_DAY,
    ];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    // Should suggest THREE_HOUR before TWELVE_HOUR, TWO_DAY, or SEVEN_DAY
    expect(result).toBe(SnapshotType.THREE_HOUR);
  });

  it('should suggest day snapshots in order', () => {
    const postDate = subDays(new Date(), 14);
    const existingTypes = [
      SnapshotType.ONE_HOUR,
      SnapshotType.THREE_HOUR,
      SnapshotType.SIX_HOUR,
      SnapshotType.TWELVE_HOUR,
      SnapshotType.ONE_DAY,
    ];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBe(SnapshotType.TWO_DAY);
  });

  it('should suggest THIRTY_DAY if all others exist', () => {
    const postDate = subDays(new Date(), 30);
    const existingTypes = [
      SnapshotType.ONE_HOUR,
      SnapshotType.THREE_HOUR,
      SnapshotType.SIX_HOUR,
      SnapshotType.TWELVE_HOUR,
      SnapshotType.ONE_DAY,
      SnapshotType.TWO_DAY,
      SnapshotType.SEVEN_DAY,
      SnapshotType.FOURTEEN_DAY,
    ];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBe(SnapshotType.THIRTY_DAY);
  });

  it('should return null when all snapshots for 30+ day video are recorded', () => {
    const postDate = subDays(new Date(), 30);
    const existingTypes = [
      SnapshotType.ONE_HOUR,
      SnapshotType.THREE_HOUR,
      SnapshotType.SIX_HOUR,
      SnapshotType.TWELVE_HOUR,
      SnapshotType.ONE_DAY,
      SnapshotType.TWO_DAY,
      SnapshotType.SEVEN_DAY,
      SnapshotType.FOURTEEN_DAY,
      SnapshotType.THIRTY_DAY,
    ];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    expect(result).toBeNull();
  });

  it('should handle out-of-order existing snapshots', () => {
    const postDate = subDays(new Date(), 7);
    const existingTypes = [
      SnapshotType.SEVEN_DAY,
      SnapshotType.ONE_DAY,
      SnapshotType.TWELVE_HOUR,
    ];

    const result = getNextSuggestedSnapshot(postDate, existingTypes);

    // Should suggest ONE_HOUR as first in order
    expect(result).toBe(SnapshotType.ONE_HOUR);
  });
});
