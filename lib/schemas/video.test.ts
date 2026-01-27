import { describe, it, expect } from 'vitest';
import { VideoStatus } from '@/lib/generated/client';
import {
  createVideoSchema,
  updateVideoSchema,
  updateVideoStatusSchema,
} from './video';

describe('Video Schemas', () => {
  describe('createVideoSchema', () => {
    it('should validate a valid video creation input', () => {
      const input = {
        title: 'My TikTok Video',
        script: 'This is the script content',
        description: 'This is the description',
        videoLengthSeconds: 30,
        hashtags: ['fyp', 'viral', 'comedy'],
      };

      const result = createVideoSchema.parse(input);

      expect(result.title).toBe(input.title);
      expect(result.status).toBe(VideoStatus.DRAFT); // default
      expect(result.hashtags).toEqual(input.hashtags);
    });

    it('should set default status to DRAFT', () => {
      const input = {
        title: 'Test',
        script: 'Test script',
        description: 'Test description',
        videoLengthSeconds: 30,
      };

      const result = createVideoSchema.parse(input);

      expect(result.status).toBe(VideoStatus.DRAFT);
    });

    it('should set default hashtags to empty array', () => {
      const input = {
        title: 'Test',
        script: 'Test script',
        description: 'Test description',
        videoLengthSeconds: 30,
      };

      const result = createVideoSchema.parse(input);

      expect(result.hashtags).toEqual([]);
    });

    it('should reject empty title', () => {
      const input = {
        title: '',
        script: 'Test script',
        description: 'Test description',
        videoLengthSeconds: 30,
      };

      expect(() => createVideoSchema.parse(input)).toThrow('Title is required');
    });

    it('should reject negative video length', () => {
      const input = {
        title: 'Test',
        script: 'Test script',
        description: 'Test description',
        videoLengthSeconds: -10,
      };

      expect(() => createVideoSchema.parse(input)).toThrow('Video length must be positive');
    });

    it('should reject zero video length', () => {
      const input = {
        title: 'Test',
        script: 'Test script',
        description: 'Test description',
        videoLengthSeconds: 0,
      };

      expect(() => createVideoSchema.parse(input)).toThrow('Video length must be positive');
    });
  });

  describe('updateVideoSchema', () => {
    it('should validate partial updates', () => {
      const input = {
        title: 'Updated title',
      };

      const result = updateVideoSchema.parse(input);

      expect(result.title).toBe(input.title);
      expect(result.script).toBeUndefined();
    });

    it('should validate multiple field updates', () => {
      const input = {
        title: 'Updated title',
        videoLengthSeconds: 45,
        hashtags: ['newhashtag'],
      };

      const result = updateVideoSchema.parse(input);

      expect(result.title).toBe(input.title);
      expect(result.videoLengthSeconds).toBe(45);
      expect(result.hashtags).toEqual(['newhashtag']);
    });

    it('should allow empty updates', () => {
      const input = {};

      const result = updateVideoSchema.parse(input);

      expect(result).toEqual({});
    });
  });

  describe('updateVideoStatusSchema', () => {
    it('should allow DRAFT → PUBLISHED transition', () => {
      const input = {
        currentStatus: VideoStatus.DRAFT,
        newStatus: VideoStatus.PUBLISHED,
      };

      const result = updateVideoStatusSchema.parse(input);

      expect(result.newStatus).toBe(VideoStatus.PUBLISHED);
    });

    it('should allow PUBLISHED → ARCHIVED transition', () => {
      const input = {
        currentStatus: VideoStatus.PUBLISHED,
        newStatus: VideoStatus.ARCHIVED,
      };

      const result = updateVideoStatusSchema.parse(input);

      expect(result.newStatus).toBe(VideoStatus.ARCHIVED);
    });

    it('should allow status to remain the same', () => {
      const input = {
        currentStatus: VideoStatus.DRAFT,
        newStatus: VideoStatus.DRAFT,
      };

      const result = updateVideoStatusSchema.parse(input);

      expect(result.newStatus).toBe(VideoStatus.DRAFT);
    });

    it('should reject DRAFT → ARCHIVED transition', () => {
      const input = {
        currentStatus: VideoStatus.DRAFT,
        newStatus: VideoStatus.ARCHIVED,
      };

      expect(() => updateVideoStatusSchema.parse(input)).toThrow('Invalid status transition');
    });

    it('should reject PUBLISHED → DRAFT transition', () => {
      const input = {
        currentStatus: VideoStatus.PUBLISHED,
        newStatus: VideoStatus.DRAFT,
      };

      expect(() => updateVideoStatusSchema.parse(input)).toThrow('Invalid status transition');
    });

    it('should reject ARCHIVED → DRAFT transition', () => {
      const input = {
        currentStatus: VideoStatus.ARCHIVED,
        newStatus: VideoStatus.DRAFT,
      };

      expect(() => updateVideoStatusSchema.parse(input)).toThrow('Invalid status transition');
    });

    it('should reject ARCHIVED → PUBLISHED transition', () => {
      const input = {
        currentStatus: VideoStatus.ARCHIVED,
        newStatus: VideoStatus.PUBLISHED,
      };

      expect(() => updateVideoStatusSchema.parse(input)).toThrow('Invalid status transition');
    });
  });
});
