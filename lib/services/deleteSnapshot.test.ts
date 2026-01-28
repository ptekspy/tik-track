import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteSnapshot } from './deleteSnapshot';
import { mockSnapshotOneHour, mockUser } from '@/lib/testing/mocks';

// Mock auth
vi.mock('@/lib/auth/server', () => ({
  requireUser: vi.fn(),
}));

// Mock the database client
vi.mock('@/lib/database/client', () => ({
  db: {
    analyticsSnapshot: {
      delete: vi.fn(),
    },
  },
}));

// Mock the DAL functions
vi.mock('@/lib/dal/snapshots', () => ({
  findSnapshotById: vi.fn(),
}));

import { requireUser } from '@/lib/auth/server';
import { db } from '@/lib/database/client';
import { findSnapshotById } from '@/lib/dal/snapshots';

describe('deleteSnapshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue(mockUser);
  });

  it('should delete an existing snapshot', async () => {
    vi.mocked(findSnapshotById).mockResolvedValue(mockSnapshotOneHour);
    vi.mocked(db.analyticsSnapshot.delete).mockResolvedValue(mockSnapshotOneHour);

    await deleteSnapshot(mockSnapshotOneHour.id);

    expect(findSnapshotById).toHaveBeenCalledWith(mockSnapshotOneHour.id);
    expect(db.analyticsSnapshot.delete).toHaveBeenCalledWith({
      where: { id: mockSnapshotOneHour.id },
    });
  });

  it('should throw error if snapshot not found', async () => {
    vi.mocked(findSnapshotById).mockResolvedValue(null);

    await expect(deleteSnapshot('non-existent-id')).rejects.toThrow(
      'Snapshot with ID non-existent-id not found'
    );

    expect(db.analyticsSnapshot.delete).not.toHaveBeenCalled();
  });
});
