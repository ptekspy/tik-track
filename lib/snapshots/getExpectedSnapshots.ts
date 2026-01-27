import { SnapshotType } from '@/lib/generated/client';
import { differenceInHours, differenceInDays } from 'date-fns';

/**
 * Get the list of expected snapshot types based on time elapsed since post date
 * 
 * @param postDate - The date when the video was posted
 * @returns Array of expected snapshot types
 */
export const getExpectedSnapshots = (postDate: Date): SnapshotType[] => {
  const now = new Date();
  const hoursElapsed = differenceInHours(now, postDate);
  const daysElapsed = differenceInDays(now, postDate);

  const expected: SnapshotType[] = [];

  if (hoursElapsed >= 1) expected.push(SnapshotType.ONE_HOUR);
  if (hoursElapsed >= 3) expected.push(SnapshotType.THREE_HOUR);
  if (hoursElapsed >= 6) expected.push(SnapshotType.SIX_HOUR);
  if (hoursElapsed >= 12) expected.push(SnapshotType.TWELVE_HOUR);
  if (daysElapsed >= 1) expected.push(SnapshotType.ONE_DAY);
  if (daysElapsed >= 2) expected.push(SnapshotType.TWO_DAY);
  if (daysElapsed >= 7) expected.push(SnapshotType.SEVEN_DAY);
  if (daysElapsed >= 14) expected.push(SnapshotType.FOURTEEN_DAY);
  if (daysElapsed >= 30) expected.push(SnapshotType.THIRTY_DAY);

  return expected;
};
