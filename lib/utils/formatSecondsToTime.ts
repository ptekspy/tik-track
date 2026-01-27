/**
 * Format seconds to human-readable time string
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "0h:18m:56s" or "4.3s")
 */
export const formatSecondsToTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h:${minutes}m:${remainingSeconds}s`;
  }

  return `${minutes}m:${remainingSeconds}s`;
};
