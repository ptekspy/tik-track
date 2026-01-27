import { findSnapshotById } from '@/lib/dal/snapshots';
import { db } from '@/lib/database/client';

/**
 * Delete an analytics snapshot
 * 
 * @param snapshotId - Snapshot ID to delete
 * @throws Error if snapshot not found
 */
export const deleteSnapshot = async (snapshotId: string): Promise<void> => {
  // Check snapshot exists
  const snapshot = await findSnapshotById(snapshotId);
  
  if (!snapshot) {
    throw new Error(`Snapshot with ID ${snapshotId} not found`);
  }

  // Delete snapshot
  await db.analyticsSnapshot.delete({
    where: { id: snapshotId },
  });
};
