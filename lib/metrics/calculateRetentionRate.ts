/**
 * Calculate retention rate (average watch time as percentage of video length)
 * Formula: avgWatchTime / videoLength × 100
 * 
 * @param avgWatchTimeSeconds - Average watch time in seconds
 * @param videoLengthSeconds - Total video length in seconds
 * @returns Retention rate as a percentage, or null if videoLength is 0 or values are invalid
 */
export const calculateRetentionRate = (
  avgWatchTimeSeconds: number | null,
  videoLengthSeconds: number
): number | null => {
  if (!avgWatchTimeSeconds || avgWatchTimeSeconds === 0) {
    return null;
  }

  if (!videoLengthSeconds || videoLengthSeconds === 0) {
    return null;
  }

  return (avgWatchTimeSeconds / videoLengthSeconds) * 100;
};
