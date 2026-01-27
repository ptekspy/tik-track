import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatRelativeTime } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan 1[45], 2024/); // Account for timezone
    });

    it('should handle different months', () => {
      const date = new Date('2024-06-20T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jun 20, 2024/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T15:45:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('Jan');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent timestamps', () => {
      const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('should return minutes for timestamps under an hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });

    it('should return singular minute', () => {
      const date = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
      expect(formatRelativeTime(date)).toBe('1 minute ago');
    });

    it('should return hours for timestamps under a day', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
      expect(formatRelativeTime(date)).toBe('3 hours ago');
    });

    it('should return singular hour', () => {
      const date = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago
      expect(formatRelativeTime(date)).toBe('1 hour ago');
    });

    it('should return days for timestamps under a month', () => {
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      expect(formatRelativeTime(date)).toBe('5 days ago');
    });

    it('should return singular day', () => {
      const date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
      expect(formatRelativeTime(date)).toBe('1 day ago');
    });

    it('should return formatted date for old timestamps', () => {
      const date = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
      const formatted = formatRelativeTime(date);
      expect(formatted).toMatch(/\w+ \d+, \d{4}/);
    });
  });
});
