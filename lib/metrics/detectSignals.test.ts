import { describe, it, expect } from 'vitest';
import { detectSignals } from './detectSignals';

describe('detectSignals', () => {
  describe('positive signals', () => {
    it('should return positive for completion rate > 50%', () => {
      const result = detectSignals({
        completionRate: 60,
        shareRate: null,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('positive');
    });

    it('should return positive for share rate > 3%', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: 5,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('positive');
    });

    it('should return positive for follower conversion > 0.5%', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: null,
        followerConversion: 0.8,
        engagementRate: null,
      });

      expect(result).toBe('positive');
    });

    it('should return positive if multiple positive signals', () => {
      const result = detectSignals({
        completionRate: 70,
        shareRate: 4,
        followerConversion: 1,
        engagementRate: 15,
      });

      expect(result).toBe('positive');
    });

    it('should prioritize positive over negative signals', () => {
      const result = detectSignals({
        completionRate: 60, // positive
        shareRate: null,
        followerConversion: null,
        engagementRate: 0.5, // negative
      });

      expect(result).toBe('positive');
    });
  });

  describe('negative signals', () => {
    it('should return negative for completion rate < 20%', () => {
      const result = detectSignals({
        completionRate: 15,
        shareRate: null,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('negative');
    });

    it('should return negative for engagement rate < 1%', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: null,
        followerConversion: null,
        engagementRate: 0.5,
      });

      expect(result).toBe('negative');
    });

    it('should return negative if multiple negative signals', () => {
      const result = detectSignals({
        completionRate: 10,
        shareRate: null,
        followerConversion: null,
        engagementRate: 0.3,
      });

      expect(result).toBe('negative');
    });
  });

  describe('neutral signals', () => {
    it('should return neutral for moderate metrics', () => {
      const result = detectSignals({
        completionRate: 35,
        shareRate: 2,
        followerConversion: 0.3,
        engagementRate: 5,
      });

      expect(result).toBe('neutral');
    });

    it('should return neutral when all metrics are null', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: null,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('neutral');
    });

    it('should return neutral for metrics at boundaries', () => {
      const result = detectSignals({
        completionRate: 20, // boundary (not < 20)
        shareRate: 3, // boundary (not > 3)
        followerConversion: 0.5, // boundary (not > 0.5)
        engagementRate: 1, // boundary (not < 1)
      });

      expect(result).toBe('neutral');
    });
  });

  describe('edge cases', () => {
    it('should handle completion rate exactly at 50%', () => {
      const result = detectSignals({
        completionRate: 50,
        shareRate: null,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('neutral');
    });

    it('should handle share rate exactly at 3%', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: 3,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('neutral');
    });

    it('should handle follower conversion exactly at 0.5%', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: null,
        followerConversion: 0.5,
        engagementRate: null,
      });

      expect(result).toBe('neutral');
    });

    it('should handle engagement rate exactly at 1%', () => {
      const result = detectSignals({
        completionRate: null,
        shareRate: null,
        followerConversion: null,
        engagementRate: 1,
      });

      expect(result).toBe('neutral');
    });

    it('should handle completion rate exactly at 20%', () => {
      const result = detectSignals({
        completionRate: 20,
        shareRate: null,
        followerConversion: null,
        engagementRate: null,
      });

      expect(result).toBe('neutral');
    });
  });
});
