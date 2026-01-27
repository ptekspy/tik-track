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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tag
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Videos
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Views
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Engagement
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Completion
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hashtags.map((hashtag) => (
            <tr key={hashtag.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  href={`/hashtags/${encodeURIComponent(hashtag.tag)}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  #{hashtag.tag}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {hashtag.videoCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatNumber(hashtag.avgViews)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatPercentage(hashtag.avgEngagementRate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatPercentage(hashtag.avgCompletionRate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
