import { describe, it, expect } from 'vitest';
import { formatSecondsToTime } from './formatSecondsToTime';

describe('formatSecondsToTime', () => {
  it('should format seconds less than 60 with decimal', () => {
    expect(formatSecondsToTime(4.3)).toBe('4.3s');
    expect(formatSecondsToTime(15.7)).toBe('15.7s');
    expect(formatSecondsToTime(59.9)).toBe('59.9s');
  });

  it('should format exactly 60 seconds as minutes', () => {
    expect(formatSecondsToTime(60)).toBe('1m:0s');
  });

  it('should format minutes and seconds', () => {
    expect(formatSecondsToTime(90)).toBe('1m:30s');
    expect(formatSecondsToTime(125)).toBe('2m:5s');
    expect(formatSecondsToTime(3599)).toBe('59m:59s');
  });

  it('should format hours, minutes, and seconds', () => {
    expect(formatSecondsToTime(3600)).toBe('1h:0m:0s');
    expect(formatSecondsToTime(3661)).toBe('1h:1m:1s');
    expect(formatSecondsToTime(7325)).toBe('2h:2m:5s');
  });

  it('should handle zero seconds', () => {
    expect(formatSecondsToTime(0)).toBe('0.0s');
  });

  it('should handle large values', () => {
    expect(formatSecondsToTime(36000)).toBe('10h:0m:0s');
    expect(formatSecondsToTime(90000)).toBe('25h:0m:0s');
  });

  it('should round down seconds in minute/hour format', () => {
    expect(formatSecondsToTime(125.9)).toBe('2m:5s');
    expect(formatSecondsToTime(3661.9)).toBe('1h:1m:1s');
  });
});
