/**
 * Parse time components to total seconds
 * 
 * @param hours - Hours component
 * @param minutes - Minutes component
 * @param seconds - Seconds component
 * @returns Total time in seconds
 */
export const parseTimeToSeconds = (hours: number, minutes: number, seconds: number): number => {
  return hours * 3600 + minutes * 60 + seconds;
};
