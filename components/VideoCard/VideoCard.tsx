import Link from 'next/link';
import type { Video, AnalyticsSnapshot, Channel, Prisma } from '@/lib/types/server';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { SignalBadge } from '@/components/SignalBadge/SignalBadge';
import { CompactDelta } from '@/components/DeltaDisplay/DeltaDisplay';
import { Eye, TrendingUp } from 'lucide-react';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';
import { calculateShareRate } from '@/lib/metrics/calculateShareRate';
import { calculateFollowerConversion } from '@/lib/metrics/calculateFollowerConversion';
import { detectSignals } from '@/lib/metrics/detectSignals';
import { getLatestDeltas } from '@/lib/utils/deltas';
import type { SerializedSnapshot } from '@/lib/types/snapshot';

export interface VideoCardProps {
  video: Video & { snapshots: AnalyticsSnapshot[]; channel?: Channel | null };
}

/**
 * VideoCard Component
 * 
 * Displays a video summary card with status, latest metrics, deltas, and signal.
 * Links to the video detail page.
 */
export function VideoCard({ video }: VideoCardProps) {
  // Convert snapshots to serialized format for delta calculations
  const serializedSnapshots: SerializedSnapshot[] = video.snapshots.map(s => ({
    ...s,
    avgWatchTimeSeconds: s.avgWatchTimeSeconds 
      ? (typeof s.avgWatchTimeSeconds === 'object' && 'toNumber' in s.avgWatchTimeSeconds
          ? (s.avgWatchTimeSeconds as any).toNumber()
          : Number(s.avgWatchTimeSeconds))
      : null,
    completionRate: s.completionRate
      ? (typeof s.completionRate === 'object' && 'toNumber' in s.completionRate
          ? (s.completionRate as any).toNumber()
          : Number(s.completionRate))
      : null,
  }));

  // Get the latest snapshot
  const latestSnapshot = video.snapshots.length > 0
    ? video.snapshots.reduce((latest, current) =>
        new Date(current.recordedAt) > new Date(latest.recordedAt) ? current : latest
      )
    : null;

  // Calculate deltas
  const deltas = getLatestDeltas(serializedSnapshots);

  // Calculate metrics if we have a snapshot
  const views = latestSnapshot?.views || 0;
  const engagementRate = latestSnapshot
    ? calculateEngagementRate(latestSnapshot)
    : null;

  // Detect signal
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
        engagementRate,
      })
    : 'neutral';

  return (
    <Link href={`/videos/${video.id}`}>
      <div className="group relative card-hover">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fe2c55]/20 to-[#7c3aed]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative glass rounded-2xl p-6 border border-white/20 h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1 group-hover:text-[#fe2c55] transition-colors">
              {video.title}
            </h3>
            <StatusBadge status={video.status} />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {video.description}
          </p>

          {/* Metrics */}
          {latestSnapshot && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#fe2c55]/10 to-[#7c3aed]/10 rounded-lg">
                  <Eye className="w-4 h-4 text-[#fe2c55]" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {views.toLocaleString()}
                    </span>
                    {deltas?.views && (
                      <CompactDelta delta={deltas.views} />
                    )}
                  </div>
                </div>
                {engagementRate !== null && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#25f4ee]/10 to-[#4f46e5]/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[#25f4ee]" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {engagementRate.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No metrics message */}
          {!latestSnapshot && video.status === 'PUBLISHED' && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-amber-700 dark:text-amber-400">No analytics data yet</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-full"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {video.snapshots.length} snapshot{video.snapshots.length !== 1 ? 's' : ''}
                </span>
              </div>
              {video.channel && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500 px-2 py-1 bg-gray-100/50 dark:bg-gray-800/50 rounded">
                  @{video.channel.handle}
                </span>
              )}
            </div>
            {video.status === 'PUBLISHED' && <SignalBadge signal={signal} />}
          </div>
        </div>
      </div>
    </Link>
  );
}
