/**
 * Static mock objects for testing
 * These mocks match Prisma-inferred types and should be reused across all tests
 */

import type { Video, AnalyticsSnapshot, Hashtag, Channel } from '@/lib/types/server';
import { VideoStatus, SnapshotType, Prisma } from '@/lib/types/server';

// Mock user ID for testing
export const MOCK_USER_ID = '90000000-0000-4000-8000-000000000001';
export const MOCK_CHANNEL_ID = 'a0000000-0000-4000-8000-000000000001';

// Mock User for testing
export const mockUser = {
  id: MOCK_USER_ID,
  name: 'Test User',
  email: 'test@example.com',
  emailVerified: true,
  image: null,
  role: 'USER' as const,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

// Mock Channel for testing
export const mockChannel: Channel = {
  id: MOCK_CHANNEL_ID,
  userId: MOCK_USER_ID,
  name: 'Main Channel',
  handle: 'mainhandle',
  bio: 'Test channel bio',
  avatar: null,
  isDefault: true,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

// Mock Video - DRAFT
export const mockVideoDraft: Video = {
  id: '00000000-0000-4000-8000-000000000001',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  title: 'Draft Video Title',
  script: 'This is a draft video script for testing purposes.',
  description: 'Draft video description with #test #draft',
  videoLengthSeconds: 45,
  postDate: null,
  status: VideoStatus.DRAFT,
  createdAt: new Date('2026-01-27T10:00:00Z'),
  updatedAt: new Date('2026-01-27T10:00:00Z'),
};

// Mock Video - PUBLISHED
export const mockVideoPublished: Video = {
  id: '00000000-0000-4000-8000-000000000002',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  title: 'Published Video Title',
  script: 'This is a published video script about productivity tips.',
  description: 'Learn how to be more productive! #productivity #tips #tiktok',
  videoLengthSeconds: 60,
  postDate: new Date('2026-01-20T14:30:00Z'),
  status: VideoStatus.PUBLISHED,
  createdAt: new Date('2026-01-19T10:00:00Z'),
  updatedAt: new Date('2026-01-20T14:30:00Z'),
};

// Mock Video - ARCHIVED
export const mockVideoArchived: Video = {
  id: '00000000-0000-4000-8000-000000000003',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  title: 'Archived Video Title',
  script: 'This is an archived video script.',
  description: 'Old content #archived',
  videoLengthSeconds: 30,
  postDate: new Date('2025-12-01T10:00:00Z'),
  status: VideoStatus.ARCHIVED,
  createdAt: new Date('2025-11-30T10:00:00Z'),
  updatedAt: new Date('2026-01-15T10:00:00Z'),
};

// Mock AnalyticsSnapshot - 1 hour
export const mockSnapshotOneHour: AnalyticsSnapshot = {
  id: '10000000-0000-4000-8000-000000000001',
  videoId: '00000000-0000-4000-8000-000000000002',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  recordedAt: new Date('2026-01-20T15:30:00Z'),
  snapshotType: SnapshotType.ONE_HOUR,
  views: 1500,
  totalPlayTimeSeconds: 67800, // 18h 50m
  avgWatchTimeSeconds: new Prisma.Decimal(45),
  completionRate: new Prisma.Decimal(0.75), // 75%
  newFollowers: 25,
  likes: 180,
  comments: 12,
  shares: 8,
  favorites: 15,
  profileViews: 45,
  reach: 2100,
};

// Mock AnalyticsSnapshot - 24 hours (alias for 1 day)
export const mockSnapshotTwentyFourHours: AnalyticsSnapshot = {
  id: '10000000-0000-4000-8000-000000000002',
  videoId: '00000000-0000-4000-8000-000000000002',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  recordedAt: new Date('2026-01-21T14:30:00Z'),
  snapshotType: SnapshotType.ONE_DAY,
  views: 12500,
  totalPlayTimeSeconds: 562500, // 156h 15m
  avgWatchTimeSeconds: new Prisma.Decimal(45),
  completionRate: new Prisma.Decimal(0.68), // 68%
  newFollowers: 145,
  likes: 1250,
  comments: 85,
  shares: 42,
  favorites: 98,
  profileViews: 280,
  reach: 15800,
};

export const mockSnapshotOneDay = mockSnapshotTwentyFourHours;

// Mock AnalyticsSnapshot - 7 days
export const mockSnapshotSevenDay: AnalyticsSnapshot = {
  id: '10000000-0000-4000-8000-000000000003',
  videoId: '00000000-0000-4000-8000-000000000002',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  recordedAt: new Date('2026-01-27T14:30:00Z'),
  snapshotType: SnapshotType.SEVEN_DAY,
  views: 45000,
  totalPlayTimeSeconds: 2025000, // 562h 30m
  avgWatchTimeSeconds: new Prisma.Decimal(45),
  completionRate: new Prisma.Decimal(0.62), // 62%
  newFollowers: 420,
  likes: 4200,
  comments: 280,
  shares: 125,
  favorites: 310,
  profileViews: 890,
  reach: 52000,
};

// Mock AnalyticsSnapshot with minimal data (nulls)
export const mockSnapshotMinimal: AnalyticsSnapshot = {
  id: '10000000-0000-4000-8000-000000000004',
  videoId: '00000000-0000-4000-8000-000000000002',
  userId: MOCK_USER_ID,
  channelId: MOCK_CHANNEL_ID,
  recordedAt: new Date('2026-01-20T15:30:00Z'),
  snapshotType: SnapshotType.THREE_HOUR,
  views: 100,
  totalPlayTimeSeconds: null,
  avgWatchTimeSeconds: null,
  completionRate: null,
  newFollowers: 0,
  likes: 5,
  comments: 0,
  shares: 0,
  favorites: null,
  profileViews: null,
  reach: null,
};

// Mock Hashtag
export const mockHashtag: Hashtag = {
  id: '20000000-0000-4000-8000-000000000001',
  tag: 'productivity',
  createdAt: new Date('2026-01-15T10:00:00Z'),
};

export const mockHashtag1: Hashtag = mockHashtag;

export const mockHashtag2: Hashtag = {
  id: '20000000-0000-4000-8000-000000000002',
  tag: 'tips',
  createdAt: new Date('2026-01-15T10:00:00Z'),
};

export const mockHashtag3: Hashtag = {
  id: '20000000-0000-4000-8000-000000000003',
  tag: 'tiktok',
  createdAt: new Date('2026-01-10T10:00:00Z'),
};

// Mock VideoWithSnapshots (composite)
export const mockVideoWithSnapshots = {
  ...mockVideoPublished,
  snapshots: [mockSnapshotOneHour, mockSnapshotOneDay, mockSnapshotSevenDay],
};

// Mock VideoWithHashtags (composite)
export const mockVideoWithHashtags = {
  ...mockVideoPublished,
  hashtags: [
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag1.id,
      position: 0,
      hashtag: mockHashtag1,
    },
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag2.id,
      position: 1,
      hashtag: mockHashtag2,
    },
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag3.id,
      position: 2,
      hashtag: mockHashtag3,
    },
  ],
};

// Mock VideoWithAll (snapshots + hashtags)
export const mockVideoWithAll = {
  ...mockVideoPublished,
  snapshots: [mockSnapshotOneHour, mockSnapshotOneDay, mockSnapshotSevenDay],
  hashtags: [
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag1.id,
      position: 0,
      hashtag: mockHashtag1,
    },
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag2.id,
      position: 1,
      hashtag: mockHashtag2,
    },
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag3.id,
      position: 2,
      hashtag: mockHashtag3,
    },
  ],
};

// Mock HashtagWithVideos (composite)
export const mockHashtagWithVideos = {
  ...mockHashtag1,
  videos: [
    {
      videoId: mockVideoPublished.id,
      hashtagId: mockHashtag1.id,
      position: 0,
      video: mockVideoPublished,
    },
  ],
};
