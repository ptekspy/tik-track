import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { HashtagDetail, HashtagStats } from '@/components/HashtagDetail/HashtagDetail';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { VideoWithSnapshots } from '@/lib/types/video';
import { VideoStatus } from '@/lib/types/server';
import { HashtagWithVideos } from '@/lib/types/hashtag';

interface HashtagDetailPageProps {
  params: Promise<{ tag: string }>;
}

export default async function HashtagDetailPage({ params }: HashtagDetailPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const hashtag = await db.hashtag.findUnique({
    where: { tag: decodedTag },
    include: {
      videos: {
        include: {
          video: {
            include: {
              snapshots: true,
            },
          },
        },
        orderBy: { video: { createdAt: 'desc' } },
      },
    },
  });

  if (!hashtag) {
    notFound();
  }

  const videos = hashtag.videos.map((vh: any) => vh.video) as VideoWithSnapshots[];
  
  // Compute stats
  const totalVideos = videos.length;
  const publishedVideos = videos.filter(v => v.status === VideoStatus.PUBLISHED).length;
  const totalViews = videos.reduce((sum, v) => {
    const latestSnapshot = v.snapshots[v.snapshots.length - 1];
    return sum + (latestSnapshot?.views ?? 0);
  }, 0);
  const avgViews = totalVideos > 0 ? totalViews / totalVideos : 0;

  const stats: HashtagStats = {
    totalVideos,
    publishedVideos,
    totalViews,
    avgViews,
    avgEngagementRate: null,
    avgCompletionRate: null,
  };

  const hashtagWithVideos = hashtag as unknown as HashtagWithVideos;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <HashtagDetail hashtag={hashtagWithVideos} stats={stats} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Videos ({videos.length})
        </h2>

        {videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">
              No videos found with this hashtag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
