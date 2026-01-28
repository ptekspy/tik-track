import type { PrismaClient, VideoStatus } from '@/lib/generated/client/client';

export interface CreateVideoInput {
  title: string;
  script: string;
  description: string;
  videoLengthSeconds: number;
  status?: VideoStatus;
  postDate?: Date;
  hashtags?: string[];
}

export async function createVideo(prisma: PrismaClient, userId: string, channelId: string, input: CreateVideoInput) {
  const { hashtags = [], ...videoData } = input;

  return await prisma.video.create({
    data: {
      ...videoData,
      userId,
      channelId,
      status: videoData.status || 'DRAFT',
      hashtags: hashtags.length > 0 ? {
        create: await Promise.all(
          hashtags.map(async (tag, index) => {
            // Find or create hashtag
            let hashtag = await prisma.hashtag.findUnique({ where: { tag } });
            if (!hashtag) {
              hashtag = await prisma.hashtag.create({ data: { tag } });
            }
            return {
              hashtagId: hashtag.id,
              position: index,
            };
          })
        ),
      } : undefined,
    },
    include: {
      snapshots: true,
      hashtags: {
        include: {
          hashtag: true,
        },
      },
    },
  });
}
