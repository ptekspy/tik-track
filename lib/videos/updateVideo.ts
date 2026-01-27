import type { PrismaClient, VideoStatus } from '@/lib/generated/client';

export interface UpdateVideoInput {
  title?: string;
  script?: string;
  description?: string;
  videoLengthSeconds?: number;
  status?: VideoStatus;
  postDate?: Date | null;
  hashtags?: string[];
}

export async function updateVideo(
  prisma: PrismaClient,
  videoId: string,
  input: UpdateVideoInput
) {
  const { hashtags, ...videoData } = input;

  // If hashtags are provided, we need to replace them
  if (hashtags !== undefined) {
    // Delete existing hashtags
    await prisma.videoHashtag.deleteMany({
      where: { videoId },
    });

    // Create new hashtags
    if (hashtags.length > 0) {
      await Promise.all(
        hashtags.map(async (tag, index) => {
          // Find or create hashtag
          let hashtag = await prisma.hashtag.findUnique({ where: { tag } });
          if (!hashtag) {
            hashtag = await prisma.hashtag.create({ data: { tag } });
          }
          await prisma.videoHashtag.create({
            data: {
              videoId,
              hashtagId: hashtag.id,
              position: index,
            },
          });
        })
      );
    }
  }

  return await prisma.video.update({
    where: { id: videoId },
    data: videoData,
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
