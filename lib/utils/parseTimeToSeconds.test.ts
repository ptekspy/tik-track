import { describe, it, expect } from 'vitest';
import { parseTimeToSeconds } from './parseTimeToSeconds';

describe('parseTimeToSeconds', () => {
  it('should parse hours, minutes, and seconds', () => {
    expect(parseTimeToSeconds(1, 30, 45)).toBe(5445);
    expect(parseTimeToSeconds(2, 15, 30)).toBe(8130);
  });

  it('should handle zero values', () => {
    expect(parseTimeToSeconds(0, 0, 0)).toBe(0);
    expect(parseTimeToSeconds(0, 0, 30)).toBe(30);
    expect(parseTimeToSeconds(0, 5, 0)).toBe(300);
    expect(parseTimeToSeconds(1, 0, 0)).toBe(3600);
  });

  it('should handle only seconds', () => {
    expect(parseTimeToSeconds(0, 0, 45)).toBe(45);
  });

  it('should handle only minutes', () => {
    expect(parseTimeToSeconds(0, 5, 0)).toBe(300);
  });

  it('should handle only hours', () => {
    expect(parseTimeToSeconds(2, 0, 0)).toBe(7200);
  });

  it('should handle large values', () => {
    expect(parseTimeToSeconds(10, 0, 0)).toBe(36000);
    expect(parseTimeToSeconds(24, 0, 0)).toBe(86400);
  });

  it('should handle decimal values', () => {
    expect(parseTimeToSeconds(1.5, 2.5, 3.5)).toBe(5553.5);
  });
});
