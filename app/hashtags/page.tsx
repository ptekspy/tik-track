import { db } from '@/lib/db';
import { HashtagList } from '@/components/HashtagList/HashtagList';
import { HashtagActions } from '@/components/HashtagActions/HashtagActions';
import type { HashtagWithStats } from '@/lib/types/hashtag';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HashtagsPage() {
  const hashtagsFromDb = await db.hashtag.findMany({
    include: {
      videos: {
        include: {
          video: {
            include: {
              snapshots: true,
            },
          },
        },
      },
    },
    orderBy: { tag: 'asc' },
  });

  const allHashtags = await db.hashtag.findMany({
    orderBy: { tag: 'asc' },
  });

  // Compute stats for each hashtag
  const hashtags: HashtagWithStats[] = hashtagsFromDb.map(hashtag => {
    const videos = hashtag.videos.map((vh: any) => vh.video);
    const videoCount = videos.length;
    
    return {
      id: hashtag.id,
      createdAt: hashtag.createdAt,
      tag: hashtag.tag,
      videoCount,
      avgEngagementRate: null, // Would need to compute from snapshots
      avgViews: null, // Would need to compute from snapshots
      avgCompletionRate: null, // Would need to compute from snapshots
    };
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">#️⃣</span>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Hashtags
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track hashtags across your videos
            </p>
          </div>
        </div>
        <HashtagActions hashtags={allHashtags} />
      </div>

      {hashtags.length > 0 ? (
        <HashtagList hashtags={hashtags} />
      ) : (
        <div className="glass rounded-2xl border border-white/20 p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full mb-6">
            <span className="text-4xl">#️⃣</span>
          </div>
          <p className="text-gray-900 dark:text-white text-xl font-semibold mb-2">
            No hashtags yet
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Add hashtags to your videos to start tracking their performance.
          </p>
          <a
            href="/videos/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Video with Hashtags
          </a>
        </div>
      )}
    </div>
  );
}
