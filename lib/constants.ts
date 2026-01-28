/**
 * Enum constants that can be safely imported in both client and server components
 * These are plain JavaScript objects, not tied to Prisma runtime
 */

export const VideoStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const SnapshotType = {
  ONE_HOUR: 'ONE_HOUR',
  TWO_HOUR: 'TWO_HOUR',
  THREE_HOUR: 'THREE_HOUR',
  SIX_HOUR: 'SIX_HOUR',
  TWELVE_HOUR: 'TWELVE_HOUR',
  ONE_DAY: 'ONE_DAY',
  TWO_DAY: 'TWO_DAY',
  SEVEN_DAY: 'SEVEN_DAY',
  FOURTEEN_DAY: 'FOURTEEN_DAY',
  THIRTY_DAY: 'THIRTY_DAY',
} as const;

// Export types derived from the constants
export type VideoStatus = typeof VideoStatus[keyof typeof VideoStatus];
export type SnapshotType = typeof SnapshotType[keyof typeof SnapshotType];
