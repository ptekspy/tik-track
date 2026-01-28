import { describe, it, expect } from 'vitest';
import { Prisma, VideoStatus, SnapshotType } from '@/lib/generated/client/client';

describe('Prisma Client Setup', () => {
  it('should have Prisma.Decimal constructor', () => {
    const decimal = new Prisma.Decimal(0.5);
    expect(decimal).toBeDefined();
    expect(decimal.toString()).toBe('0.5');
  });

  it('should have VideoStatus enum', () => {
    expect(VideoStatus.DRAFT).toBe('DRAFT');
    expect(VideoStatus.PUBLISHED).toBe('PUBLISHED');
    expect(VideoStatus.ARCHIVED).toBe('ARCHIVED');
  });

  it('should have SnapshotType enum', () => {
    expect(SnapshotType.ONE_HOUR).toBe('ONE_HOUR');
    expect(SnapshotType.ONE_DAY).toBe('ONE_DAY');
    expect(SnapshotType.SEVEN_DAY).toBe('SEVEN_DAY');
  });
});
