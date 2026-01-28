import Link from 'next/link';
import { HashtagWithVideos } from '@/lib/types/hashtag';
import { VideoStatus } from '@/lib/constants';
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
      <div className="glass rounded-2xl p-8 border border-white/20">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-4xl">#️⃣</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            #{hashtag.tag}
          </h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-14">
          Created {formatDate(hashtag.createdAt)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📹</span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Videos</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">{stats.totalVideos}</div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">{stats.publishedVideos}</div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#fe2c55]/20 to-[#7c3aed]/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">👁️</span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent">{formatNumber(stats.totalViews)}</div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Views</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">{formatNumber(stats.avgViews)}</div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">💫</span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Engagement</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">{formatPercentage(stats.avgEngagementRate)}</div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Completion</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">{formatPercentage(stats.avgCompletionRate)}</div>
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
                      <StatusBadge status={videoHashtag.video.status} />
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
