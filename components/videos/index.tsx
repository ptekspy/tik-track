// Re-export existing components
export { VideoForm } from '../VideoForm/VideoForm';
export { VideoGrid } from '../VideoGrid/VideoGrid';

// Create wrapper components for page usage
import Link from 'next/link';
import { SerializedVideoWithSnapshots } from '@/lib/types/video';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { CompactDelta } from '../DeltaDisplay/DeltaDisplay';
import { formatDate } from '@/lib/utils/dateUtils';
import { getLatestDeltas } from '@/lib/utils/deltas';
import { Edit, Plus } from 'lucide-react';

export function VideoHeader({ video }: { video: SerializedVideoWithSnapshots }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-8 border border-white/20 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent break-words">
              {video.title}
            </h1>
            <StatusBadge status={video.status} />
          </div>
          {video.description && (
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mt-2">
              {video.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 sm:ml-4 flex-shrink-0">
          <Link
            href={`/videos/${video.id}/edit`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all"
          >
            <Edit className="w-4 h-4" />
            <span className="whitespace-nowrap">Edit</span>
          </Link>
          <Link
            href={`/videos/${video.id}/snapshots/new`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all btn-glow"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Add Snapshot</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function VideoMetrics({ video }: { video: SerializedVideoWithSnapshots }) {
  const latestSnapshot = video.snapshots.length > 0
    ? [...video.snapshots].sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())[0]
    : null;

  // Calculate deltas
  const deltas = getLatestDeltas(video.snapshots);

  const metrics = [
    { label: 'Views', value: latestSnapshot?.views, delta: deltas?.views, gradient: 'from-blue-500 to-cyan-500', icon: '👁️' },
    { label: 'Likes', value: latestSnapshot?.likes, delta: deltas?.likes, gradient: 'from-pink-500 to-rose-500', icon: '❤️' },
    { label: 'Comments', value: latestSnapshot?.comments, delta: deltas?.comments, gradient: 'from-purple-500 to-violet-500', icon: '💬' },
    { label: 'Shares', value: latestSnapshot?.shares, delta: deltas?.shares, gradient: 'from-amber-500 to-orange-500', icon: '📤' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="group relative card-hover">
          <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity`}></div>
          <div className="relative glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</dt>
              <span className="text-2xl">{metric.icon}</span>
            </div>
            <dd className="space-y-1">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metric.value !== null && metric.value !== undefined ? metric.value.toLocaleString() : '—'}
              </div>
              {metric.delta && (
                <div className="text-xs">
                  <CompactDelta delta={metric.delta} />
                </div>
              )}
            </dd>
          </div>
        </div>
      ))}
    </div>
  );
}
