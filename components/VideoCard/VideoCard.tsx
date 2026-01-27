import Link from 'next/link';
import type { Video, AnalyticsSnapshot } from '@/lib/generated/client';
import { Prisma } from '@/lib/generated/client';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { SignalBadge } from '@/components/SignalBadge/SignalBadge';
import { Eye, TrendingUp } from 'lucide-react';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';
import { calculateShareRate } from '@/lib/metrics/calculateShareRate';
import { calculateFollowerConversion } from '@/lib/metrics/calculateFollowerConversion';
import { detectSignals } from '@/lib/metrics/detectSignals';

export interface VideoCardProps {
  video: Video & { snapshots: AnalyticsSnapshot[] };
}

/**
 * VideoCard Component
 * 
 * Displays a video summary card with status, latest metrics, and signal.
 * Links to the video detail page.
 */
export function VideoCard({ video }: VideoCardProps) {
  // Get the latest snapshot
  const latestSnapshot = video.snapshots.length > 0
    ? video.snapshots.reduce((latest, current) =>
        new Date(current.recordedAt) > new Date(latest.recordedAt) ? current : latest
      )
    : null;

  // Calculate metrics if we have a snapshot
  const views = latestSnapshot?.views || 0;
  const engagementRate = latestSnapshot
    ? calculateEngagementRate(latestSnapshot)
    : null;

  // Detect signal
  const completionRateNum = latestSnapshot?.completionRate 
    ? (latestSnapshot.completionRate instanceof Prisma.Decimal 
        ? latestSnapshot.completionRate.toNumber() 
        : latestSnapshot.completionRate)
    : null;
    
  const signal = latestSnapshot
    ? detectSignals({
        completionRate: completionRateNum,
        shareRate: calculateShareRate(latestSnapshot),
        followerConversion: calculateFollowerConversion(latestSnapshot),
        engagementRate,
      })
    : 'neutral';

  return (
    <Link href={`/videos/${video.id}`}>
      <div className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {video.title}
          </h3>
          <StatusBadge status={video.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {video.description}
        </p>

        {/* Metrics */}
        {latestSnapshot && (
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-500" />
              <span>{views.toLocaleString()} views</span>
            </div>
            {engagementRate !== null && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span>{engagementRate.toFixed(2)}% engagement</span>
              </div>
            )}
          </div>
        )}

        {/* No metrics message */}
        {!latestSnapshot && video.status === 'PUBLISHED' && (
          <p className="text-sm text-gray-500 mb-3">No analytics data yet</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-xs text-gray-500">
            {video.snapshots.length} snapshot{video.snapshots.length !== 1 ? 's' : ''}
          </div>
          {video.status === 'PUBLISHED' && <SignalBadge signal={signal} />}
        </div>
      </div>
    </Link>
  );
}
