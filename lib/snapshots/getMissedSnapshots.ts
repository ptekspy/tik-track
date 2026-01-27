import { SnapshotType } from '@/lib/generated/client';
import { getExpectedSnapshots } from './getExpectedSnapshots';

/**
 * Get the list of snapshot types that are expected but missing
 * 
 * @param postDate - The date when the video was posted
 * @param existingTypes - Array of snapshot types that already exist
 * @returns Array of missed snapshot types
 */
export const getMissedSnapshots = (
  postDate: Date,
  existingTypes: SnapshotType[]
): SnapshotType[] => {
  const expected = getExpectedSnapshots(postDate);
  return expected.filter((type) => !existingTypes.includes(type));
};
