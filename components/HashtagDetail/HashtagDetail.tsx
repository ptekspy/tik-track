import Link from 'next/link';
import { HashtagWithVideos } from '@/lib/types/hashtag';
import { VideoStatus } from '@/lib/types/prisma';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { formatDate } from '@/lib/utils/dateUtils';

export interface HashtagStats {
  totalVideos: number;
  publishedVideos: number;
  totalViews: number;
  avgViews: number;
  avgEngagementRate: number | null;
  avgCompletionRate: number | null;
}

export interface HashtagDetailProps {
  hashtag: HashtagWithVideos;
  stats: HashtagStats;
}

export function HashtagDetail({ hashtag, stats }: HashtagDetailProps) {
  const formatNumber = (value: number | null): string => {
    return value !== null ? value.toLocaleString() : '—';
  };

  const formatPercentage = (value: number | null): string => {
    return value !== null ? `${Math.round(value)}%` : '—';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          #{hashtag.tag}
        </h1>
        <p className="text-sm text-gray-500">
          Created {formatDate(hashtag.createdAt)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Videos</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalVideos}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Published Videos</div>
          <div className="text-2xl font-bold text-gray-900">{stats.publishedVideos}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Avg Views</div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.avgViews)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Avg Engagement</div>
          <div className="text-2xl font-bold text-gray-900">{formatPercentage(stats.avgEngagementRate)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Avg Completion</div>
          <div className="text-2xl font-bold text-gray-900">{formatPercentage(stats.avgCompletionRate)}</div>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Videos Using This Hashtag
        </h2>

        {hashtag.videos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No videos are using this hashtag yet.
          </p>
        ) : (
          <div className="space-y-4">
            {hashtag.videos.map((videoHashtag) => (
              <div
                key={videoHashtag.video.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/videos/${videoHashtag.video.id}`}
                      className="text-lg font-medium text-blue-600 hover:text-blue-800"
                    >
                      {videoHashtag.video.title}
                    </Link>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge status={videoHashtag.video.status as any} />
                      {videoHashtag.video.postDate && (
                        <span className="text-sm text-gray-500">
                          Posted {formatDate(videoHashtag.video.postDate)}
                        </span>
                      )}
                    </div>

                    {videoHashtag.video.description && videoHashtag.video.description.trim() && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {videoHashtag.video.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 text-sm text-gray-500">
                    Position #{videoHashtag.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
