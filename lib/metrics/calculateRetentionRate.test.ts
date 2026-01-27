import { describe, it, expect } from 'vitest';
import { calculateRetentionRate } from './calculateRetentionRate';

describe('calculateRetentionRate', () => {
  it('should calculate retention rate correctly', () => {
    const result = calculateRetentionRate(15, 30);

    // 15 / 30 * 100 = 50%
    expect(result).toBe(50);
  });

  it('should return null if avgWatchTime is null', () => {
    const result = calculateRetentionRate(null, 30);

    expect(result).toBeNull();
  });

  it('should return null if avgWatchTime is 0', () => {
    const result = calculateRetentionRate(0, 30);

    expect(result).toBeNull();
  });

  it('should return null if videoLength is 0', () => {
    const result = calculateRetentionRate(15, 0);

    expect(result).toBeNull();
  });

  it('should calculate correctly for full retention', () => {
    const result = calculateRetentionRate(30, 30);

    expect(result).toBe(100);
  });

  it('should calculate correctly for over 100% retention (replays)', () => {
    const result = calculateRetentionRate(45, 30);

    // 45 / 30 * 100 = 150%
    expect(result).toBe(150);
  });

  it('should calculate correctly for low retention', () => {
    const result = calculateRetentionRate(3, 60);

    // 3 / 60 * 100 = 5%
    expect(result).toBe(5);
  });

  it('should handle decimal values correctly', () => {
    const result = calculateRetentionRate(12.5, 25);

    // 12.5 / 25 * 100 = 50%
    expect(result).toBe(50);
  });
});
