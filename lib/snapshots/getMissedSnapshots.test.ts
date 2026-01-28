import { describe, it, expect } from 'vitest';
import { SnapshotType } from '@/lib/generated/client/client';
import { getMissedSnapshots } from './getMissedSnapshots';
import { subHours, subDays } from 'date-fns';

describe('getMissedSnapshots', () => {
  it('should return empty array if all expected snapshots exist', () => {
    const postDate = subHours(new Date(), 3);
    const existingTypes = [SnapshotType.ONE_HOUR, SnapshotType.THREE_HOUR];

    const result = getMissedSnapshots(postDate, existingTypes);

    expect(result).toEqual([]);
  });

  it('should return all expected if no snapshots exist', () => {
    const postDate = subDays(new Date(), 1);
    const existingTypes: SnapshotType[] = [];

    const result = getMissedSnapshots(postDate, existingTypes);

    expect(result).toHaveLength(5); // 4 hour + 1 day
    expect(result).toContain(SnapshotType.ONE_HOUR);
    expect(result).toContain(SnapshotType.ONE_DAY);
  });

  it('should return only missing snapshots', () => {
    const postDate = subDays(new Date(), 7);
    const existingTypes = [
      SnapshotType.ONE_HOUR,
      SnapshotType.SIX_HOUR,
      SnapshotType.ONE_DAY,
    ];

    const result = getMissedSnapshots(postDate, existingTypes);

    expect(result).toHaveLength(4);
    expect(result).toContain(SnapshotType.THREE_HOUR);
    expect(result).toContain(SnapshotType.TWELVE_HOUR);
    expect(result).toContain(SnapshotType.TWO_DAY);
    expect(result).toContain(SnapshotType.SEVEN_DAY);
    expect(result).not.toContain(SnapshotType.ONE_HOUR);
  });

  it('should return empty array for recently posted video', () => {
    const postDate = new Date();
    const existingTypes: SnapshotType[] = [];

    const result = getMissedSnapshots(postDate, existingTypes);

    expect(result).toEqual([]);
  });

  it('should handle partially missed snapshots', () => {
    const postDate = subDays(new Date(), 2);
    const existingTypes = [SnapshotType.ONE_HOUR, SnapshotType.ONE_DAY];

    const result = getMissedSnapshots(postDate, existingTypes);

    expect(result).toHaveLength(4);
    expect(result).toContain(SnapshotType.THREE_HOUR);
    expect(result).toContain(SnapshotType.SIX_HOUR);
    expect(result).toContain(SnapshotType.TWELVE_HOUR);
    expect(result).toContain(SnapshotType.TWO_DAY);
  });

  it('should return all missed snapshots for old video with no data', () => {
    const postDate = subDays(new Date(), 30);
    const existingTypes: SnapshotType[] = [];

    const result = getMissedSnapshots(postDate, existingTypes);

    expect(result).toHaveLength(9); // all snapshot types
  });
});
