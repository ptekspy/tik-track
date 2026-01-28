// Re-export existing components
export { VideoForm } from '../VideoForm/VideoForm';
export { VideoGrid } from '../VideoGrid/VideoGrid';

// Create wrapper components for page usage
import Link from 'next/link';
import { VideoWithSnapshots } from '@/lib/types/video';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { formatDate } from '@/lib/utils/dateUtils';

export function VideoHeader({ video }: { video: VideoWithSnapshots }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>
          <StatusBadge status={video.status} />
        </div>
        {video.description && (
          <p className="text-gray-600 mt-2">{video.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/videos/${video.id}/edit`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Edit
        </Link>
        <Link
          href={`/videos/${video.id}/snapshots/new`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Snapshot
        </Link>
      </div>
    </div>
  );
}

export function VideoMetrics({ video }: { video: VideoWithSnapshots }) {
  const latestSnapshot = video.snapshots.length > 0
    ? [...video.snapshots].sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())[0]
    : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <dt className="text-sm font-medium text-gray-500">Views</dt>
        <dd className="mt-2 text-3xl font-semibold text-gray-900">
          {latestSnapshot?.views !== null ? latestSnapshot?.views.toLocaleString() : '—'}
        </dd>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <dt className="text-sm font-medium text-gray-500">Likes</dt>
        <dd className="mt-2 text-3xl font-semibold text-gray-900">
          {latestSnapshot?.likes !== null ? latestSnapshot?.likes.toLocaleString() : '—'}
        </dd>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <dt className="text-sm font-medium text-gray-500">Comments</dt>
        <dd className="mt-2 text-3xl font-semibold text-gray-900">
          {latestSnapshot?.comments !== null ? latestSnapshot?.comments.toLocaleString() : '—'}
        </dd>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <dt className="text-sm font-medium text-gray-500">Shares</dt>
        <dd className="mt-2 text-3xl font-semibold text-gray-900">
          {latestSnapshot?.shares !== null ? latestSnapshot?.shares.toLocaleString() : '—'}
        </dd>
      </div>
    </div>
  );
}
