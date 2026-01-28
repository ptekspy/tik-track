import type { Prisma, Video } from '@/lib/generated/client/client';

export type { Video };

// Video with snapshots included
export type VideoWithSnapshots = Prisma.VideoGetPayload<{
  include: {
    snapshots: true;
  };
}>;

// Video with hashtags included
export type VideoWithHashtags = Prisma.VideoGetPayload<{
  include: {
    hashtags: {
      include: {
        hashtag: true;
      };
    };
  };
}>;

// Video with all relations (snapshots + hashtags)
export type VideoWithAll = Prisma.VideoGetPayload<{
  include: {
    snapshots: true;
    hashtags: {
      include: {
        hashtag: true;
      };
    };
  };
}>;

// Re-export VideoStatus enum from Prisma
export { VideoStatus } from '@/lib/generated/client/client';
