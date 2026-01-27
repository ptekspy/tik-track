import { db } from '@/lib/db';
import { HashtagList } from '@/components/HashtagList/HashtagList';
import { HashtagActions } from '@/components/HashtagActions/HashtagActions';
import type { HashtagWithStats } from '@/lib/types/hashtag';

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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hashtags</h1>
          <p className="text-gray-600 mt-2">
            Manage and track hashtags across your videos
          </p>
        </div>
        <HashtagActions hashtags={allHashtags} />
      </div>

      {hashtags.length > 0 ? (
        <HashtagList hashtags={hashtags} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">
            No hashtags yet. Add hashtags to your videos to start tracking
            their performance.
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
