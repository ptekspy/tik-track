import { SnapshotType } from '@/lib/types/server';
import { getMissedSnapshots } from './getMissedSnapshots';

const SNAPSHOT_ORDER: SnapshotType[] = [
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

/**
 * Get the next suggested snapshot type to record
 * Returns the first missed snapshot in chronological order
 * 
 * @param postDate - The date when the video was posted
 * @param existingTypes - Array of snapshot types that already exist
 * @returns Next snapshot type to record, or null if all expected snapshots are recorded
 */
export const getNextSuggestedSnapshot = (
  postDate: Date,
  existingTypes: SnapshotType[]
): SnapshotType | null => {
  const missed = getMissedSnapshots(postDate, existingTypes);

  if (missed.length === 0) {
    return null;
  }

  // Return the first missed snapshot in chronological order
  for (const type of SNAPSHOT_ORDER) {
    if (missed.includes(type)) {
      return type;
    }
  }

  return null;
};
