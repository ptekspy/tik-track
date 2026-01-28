import type { Prisma, Hashtag } from '@/lib/generated/client/client';

export type { Hashtag };

// Hashtag with videos included
export type HashtagWithVideos = Prisma.HashtagGetPayload<{
  include: {
    videos: {
      include: {
        video: true;
      };
    };
  };
}>;

// Hashtag with stats (not a Prisma type, computed in services)
export type HashtagWithStats = Hashtag & {
  videoCount: number;
  avgEngagementRate: number | null;
  avgViews: number | null;
  avgCompletionRate: number | null;
};
