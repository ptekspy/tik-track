'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Video, AnalyticsSnapshot, Prisma } from '@/lib/types/prisma';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { SnapshotTimeline } from '@/components/SnapshotTimeline/SnapshotTimeline';
import { SignalBadge } from '@/components/SignalBadge/SignalBadge';
import { VideoCharts } from '@/components/VideoCharts/VideoCharts';
import { formatDate } from '@/lib/utils/dateUtils';
import { detectSignals } from '@/lib/metrics/detectSignals';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';
import { calculateShareRate } from '@/lib/metrics/calculateShareRate';
import { calculateFollowerConversion } from '@/lib/metrics/calculateFollowerConversion';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface VideoDetailProps {
  video: Video & {
    snapshots: AnalyticsSnapshot[];
    hashtags: { hashtag: { id: string; tag: string } }[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onAddSnapshot?: () => void;
}

export function VideoDetail({
  video,
  onEdit,
  onDelete,
  onAddSnapshot,
}: VideoDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete this video? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete();
      router.push('/videos');
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video. Please try again.');
      setIsDeleting(false);
    }
  };

  const latestSnapshot = video.snapshots.length > 0
    ? [...video.snapshots].sort(
        (a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()
      )[0]
    : null;

  const completionRateNum = latestSnapshot?.completionRate 
    ? (typeof latestSnapshot.completionRate === 'object' && 'toNumber' in latestSnapshot.completionRate
        ? (latestSnapshot.completionRate as any).toNumber() 
        : latestSnapshot.completionRate)
    : null;

  const signal = latestSnapshot
    ? detectSignals({
        completionRate: completionRateNum,
        shareRate: calculateShareRate(latestSnapshot),
        followerConversion: calculateFollowerConversion(latestSnapshot),
        engagementRate: calculateEngagementRate(latestSnapshot),
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{video.title}</h1>
            <StatusBadge status={video.status as any} />
            {signal && video.status === 'PUBLISHED' as any && (
              <SignalBadge signal={signal} />
            )}
          </div>
          {video.description && (
            <p className="text-gray-600 mt-2">{video.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Posted</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {video.postDate ? formatDate(video.postDate) : 'Not posted'}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Hashtags</dt>
          <dd className="mt-1">
            {video.hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {video.hashtags.map(({ hashtag }) => (
                  <span
                    key={hashtag.id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    #{hashtag.tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Snapshots</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {video.snapshots.length}
          </dd>
        </div>
      </div>

      {/* Timeline */}
      {video.postDate && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Analytics Timeline</h2>
            {onAddSnapshot && (
              <button
                onClick={onAddSnapshot}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Snapshot
              </button>
            )}
          </div>
          <SnapshotTimeline video={video} />
        </div>
      )}

      {/* Charts */}
      {video.snapshots.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <VideoCharts snapshots={video.snapshots} />
        </div>
      )}

      {/* Empty State */}
      {video.status === 'PUBLISHED' && video.snapshots.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            No analytics data yet. Add your first snapshot to start tracking performance.
          </p>
          {onAddSnapshot && (
            <button
              onClick={onAddSnapshot}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Snapshot
            </button>
          )}
        </div>
      )}
    </div>
  );
}
