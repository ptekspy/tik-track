import Link from 'next/link';
import { HashtagWithStats } from '@/lib/types/hashtag';

export interface HashtagListProps {
  hashtags: HashtagWithStats[];
}

export function HashtagList({ hashtags }: HashtagListProps) {
  if (hashtags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hashtags found.
      </div>
    );
  }

  const formatNumber = (value: number | null): string => {
    return value !== null ? value.toLocaleString() : '—';
  };

  const formatPercentage = (value: number | null): string => {
    return value !== null ? `${Math.round(value)}%` : '—';
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/20 overflow-hidden">
      <div className="overflow-x-auto -mx-6">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500/10 to-pink-600/10">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tag
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Videos
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Avg Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Avg Engagement
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Avg Completion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {hashtags.map((hashtag) => (
              <tr key={hashtag.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/hashtags/${encodeURIComponent(hashtag.tag)}`}
                    className="text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent hover:from-pink-600 hover:to-purple-500 transition-all"
                  >
                    #{hashtag.tag}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-medium">
                  {hashtag.videoCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                  {formatNumber(hashtag.avgViews)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                  {formatPercentage(hashtag.avgEngagementRate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                  {formatPercentage(hashtag.avgCompletionRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
