import { describe, it, expect } from 'vitest';
import { SnapshotType, Prisma } from '@/lib/generated/client/client';
import { createSnapshotSchema, updateSnapshotSchema } from './snapshot';

describe('Snapshot Schemas', () => {
  describe('createSnapshotSchema', () => {
    it('should validate a valid snapshot creation input', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_HOUR,
        views: 1000,
        likes: 100,
        comments: 50,
        shares: 25,
        completionRate: new Prisma.Decimal(45.5),
      };

      const result = createSnapshotSchema.parse(input);

      expect(result.videoId).toBe(input.videoId);
      expect(result.snapshotType).toBe(SnapshotType.ONE_HOUR);
      expect(result.views).toBe(1000);
    });

    it('should accept completionRate as number', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_DAY,
        completionRate: 75.5,
      };

      const result = createSnapshotSchema.parse(input);

      expect(result.completionRate).toBe(75.5);
    });

    it('should accept completionRate as Prisma.Decimal', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_DAY,
        completionRate: new Prisma.Decimal(75.5),
      };

      const result = createSnapshotSchema.parse(input);

      expect(result.completionRate).toBeInstanceOf(Prisma.Decimal);
    });

    it('should reject invalid UUID for videoId', () => {
      const input = {
        videoId: 'invalid-uuid',
        snapshotType: SnapshotType.ONE_HOUR,
      };

      expect(() => createSnapshotSchema.parse(input)).toThrow('Invalid video ID');
    });

    it('should reject negative values', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_HOUR,
        views: -100,
      };

      expect(() => createSnapshotSchema.parse(input)).toThrow();
    });

    it('should reject completionRate above 100', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_HOUR,
        completionRate: 150,
      };

      expect(() => createSnapshotSchema.parse(input)).toThrow();
    });

    it('should allow all metrics to be optional', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_HOUR,
      };

      const result = createSnapshotSchema.parse(input);

      expect(result.views).toBeUndefined();
      expect(result.likes).toBeUndefined();
    });

    it('should allow metrics to be null', () => {
      const input = {
        videoId: '123e4567-e89b-12d3-a456-426614174000',
        snapshotType: SnapshotType.ONE_HOUR,
        views: null,
        likes: null,
      };

      const result = createSnapshotSchema.parse(input);

      expect(result.views).toBeNull();
      expect(result.likes).toBeNull();
    });
  });

  describe('updateSnapshotSchema', () => {
    it('should validate partial updates', () => {
      const input = {
        views: 2000,
        likes: 200,
      };

      const result = updateSnapshotSchema.parse(input);

      expect(result.views).toBe(2000);
      expect(result.likes).toBe(200);
      expect(result.comments).toBeUndefined();
    });

    it('should allow empty updates', () => {
      const input = {};

      const result = updateSnapshotSchema.parse(input);

      expect(result).toEqual({});
    });

    it('should reject negative values', () => {
      const input = {
        views: -500,
      };

      expect(() => updateSnapshotSchema.parse(input)).toThrow();
    });

    it('should allow setting values to null', () => {
      const input = {
        views: null,
        likes: null,
      };

      const result = updateSnapshotSchema.parse(input);

      expect(result.views).toBeNull();
      expect(result.likes).toBeNull();
    });
  });
});
