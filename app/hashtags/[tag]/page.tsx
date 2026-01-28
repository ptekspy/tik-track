import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { HashtagDetail, HashtagStats } from '@/components/HashtagDetail/HashtagDetail';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { VideoWithSnapshots } from '@/lib/types/video';
import { VideoStatus } from '@/lib/types/server';
import { HashtagWithVideos } from '@/lib/types/hashtag';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <HashtagDetail hashtag={hashtagWithVideos} stats={stats} />

      <div className="mt-8">
        <div className="glass rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Videos ({videos.length})
            </h2>
          </div>

          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="glass rounded-xl border border-white/20 p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full mb-4">
                <span className="text-3xl">#️⃣</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No videos found with this hashtag.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
