import { describe, it, expect } from 'vitest';
import { SnapshotType } from '@/lib/generated/client/client';
import { getExpectedSnapshots } from './getExpectedSnapshots';
import { subHours, subDays } from 'date-fns';

describe('getExpectedSnapshots', () => {
  it('should return empty array for video just posted', () => {
    const postDate = new Date();

    const result = getExpectedSnapshots(postDate);

    expect(result).toEqual([]);
  });

  it('should return ONE_HOUR after 1 hour', () => {
    const postDate = subHours(new Date(), 1);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.ONE_HOUR);
    expect(result.length).toBe(1);
  });

  it('should return ONE_HOUR and THREE_HOUR after 3 hours', () => {
    const postDate = subHours(new Date(), 3);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.ONE_HOUR);
    expect(result).toContain(SnapshotType.TWO_HOUR);
    expect(result).toContain(SnapshotType.THREE_HOUR);
    expect(result.length).toBe(3);
  });

  it('should return all hour snapshots after 12 hours', () => {
    const postDate = subHours(new Date(), 12);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.ONE_HOUR);
    expect(result).toContain(SnapshotType.TWO_HOUR);
    expect(result).toContain(SnapshotType.THREE_HOUR);
    expect(result).toContain(SnapshotType.SIX_HOUR);
    expect(result).toContain(SnapshotType.TWELVE_HOUR);
    expect(result.length).toBe(5); // 5 hour snapshots (no day snapshot yet at 12 hours)
  });

  it('should include ONE_DAY after 24 hours', () => {
    const postDate = subDays(new Date(), 1);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.ONE_DAY);
    expect(result.length).toBe(6); // 5 hour snapshots + 1 day
  });

  it('should include TWO_DAY after 2 days', () => {
    const postDate = subDays(new Date(), 2);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.TWO_DAY);
    expect(result.length).toBe(7); // 5 hour + 2 day
  });

  it('should include SEVEN_DAY after 7 days', () => {
    const postDate = subDays(new Date(), 7);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.SEVEN_DAY);
    expect(result.length).toBe(8); // 5 hour + 3 day
  });

  it('should include FOURTEEN_DAY after 14 days', () => {
    const postDate = subDays(new Date(), 14);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.FOURTEEN_DAY);
    expect(result.length).toBe(9); // 5 hour + 4 day
  });

  it('should include THIRTY_DAY after 30 days', () => {
    const postDate = subDays(new Date(), 30);

    const result = getExpectedSnapshots(postDate);

    expect(result).toContain(SnapshotType.THIRTY_DAY);
    expect(result.length).toBe(10); // all snapshots
  });

  it('should return all snapshots for very old video', () => {
    const postDate = subDays(new Date(), 100);

    const result = getExpectedSnapshots(postDate);

    expect(result).toHaveLength(10);
    expect(result).toEqual([
      SnapshotType.ONE_HOUR,
      SnapshotType.TWO_HOUR,
      SnapshotType.THREE_HOUR,
      SnapshotType.SIX_HOUR,
      SnapshotType.TWELVE_HOUR,
      SnapshotType.ONE_DAY,
      SnapshotType.TWO_DAY,
      SnapshotType.SEVEN_DAY,
      SnapshotType.FOURTEEN_DAY,
      SnapshotType.THIRTY_DAY,
    ]);
  });
});
