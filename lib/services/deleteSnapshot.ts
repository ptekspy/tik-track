import { findSnapshotById } from '@/lib/dal/snapshots';
import { db } from '@/lib/database/client';
import { requireUser } from '@/lib/auth/server';

/**
 * Delete an analytics snapshot
 * 
 * @param snapshotId - Snapshot ID to delete
 * @throws Error if snapshot not found or user not authorized
 */
export const deleteSnapshot = async (snapshotId: string): Promise<void> => {
  // Get authenticated user
  const user = await requireUser();
  
  // Check snapshot exists and user owns it
  const snapshot = await findSnapshotById(snapshotId, user.id);
  
  if (!snapshot) {
    throw new Error(`Snapshot with ID ${snapshotId} not found`);
  }

  // Delete snapshot
  await db.analyticsSnapshot.delete({
    where: { id: snapshotId, userId: user.id },
  });
};
