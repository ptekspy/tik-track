import type { Video, AnalyticsSnapshot } from '@/lib/types/prisma';
import { SnapshotType } from '@/lib/types/prisma';
import { getExpectedSnapshots } from '@/lib/snapshots/getExpectedSnapshots';
import { getMissedSnapshots } from '@/lib/snapshots/getMissedSnapshots';
import { Check, X, Clock } from 'lucide-react';

export interface SnapshotTimelineProps {
  video: Video & { snapshots: AnalyticsSnapshot[] };
  className?: string;
}

const SNAPSHOT_LABELS = {
  [SnapshotType.ONE_HOUR]: '1h',
  [SnapshotType.THREE_HOUR]: '3h',
  [SnapshotType.SIX_HOUR]: '6h',
  [SnapshotType.TWELVE_HOUR]: '12h',
  [SnapshotType.ONE_DAY]: '1d',
  [SnapshotType.TWO_DAY]: '2d',
  [SnapshotType.SEVEN_DAY]: '7d',
  [SnapshotType.FOURTEEN_DAY]: '14d',
  [SnapshotType.THIRTY_DAY]: '30d',
};

/**
 * SnapshotTimeline Component
 * 
 * Visual timeline showing completed, missed, and upcoming snapshots.
 * Green = completed, Red = missed, Gray = upcoming
 */
export function SnapshotTimeline({ video, className = '' }: SnapshotTimelineProps) {
  if (!video.postDate) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No snapshots available for draft videos
      </div>
    );
  }

  const existingTypes = video.snapshots.map(s => s.snapshotType);
  const expectedTypes = getExpectedSnapshots(video.postDate);
  const missedTypes = getMissedSnapshots(video.postDate, existingTypes);
  
  // All possible snapshot types in chronological order
  const allTypes = [
    SnapshotType.ONE_HOUR,
    SnapshotType.THREE_HOUR,
    SnapshotType.SIX_HOUR,
    SnapshotType.TWELVE_HOUR,
    SnapshotType.ONE_DAY,
    SnapshotType.TWO_DAY,
    SnapshotType.SEVEN_DAY,
    SnapshotType.FOURTEEN_DAY,
    SnapshotType.THIRTY_DAY,
  ];

  const getSnapshotStatus = (type: SnapshotType): 'completed' | 'missed' | 'upcoming' | 'not-applicable' => {
    if (!expectedTypes.includes(type)) {
      return 'not-applicable';
    }
    if (existingTypes.includes(type)) {
      return 'completed';
    }
    
    // Snapshot is expected but not completed
    // Determine if it's "upcoming" (recently expected) or "missed" (overdue)
    const now = new Date();
    const timeSincePost = (now.getTime() - video.postDate!.getTime()) / (1000 * 60 * 60); // hours
    
    // Grace period: snapshot is "upcoming" if within 2x its expected time
    const gracePeriods: Record<SnapshotType, number> = {
      [SnapshotType.ONE_HOUR]: 2,
      [SnapshotType.THREE_HOUR]: 6,
      [SnapshotType.SIX_HOUR]: 12,
      [SnapshotType.TWELVE_HOUR]: 24,
      [SnapshotType.ONE_DAY]: 48,
      [SnapshotType.TWO_DAY]: 96,
      [SnapshotType.SEVEN_DAY]: 336,
      [SnapshotType.FOURTEEN_DAY]: 672,
      [SnapshotType.THIRTY_DAY]: 1440,
    };
    
    if (timeSincePost < gracePeriods[type]) {
      return 'upcoming';
    }
    
    return 'missed';
  };

  const renderIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'missed':
        return <X className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'upcoming':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-200 opacity-50';
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        {allTypes.map((type) => {
          const status = getSnapshotStatus(type);
          
          return (
            <div
              key={type}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusStyles(status)}`}
              title={`${SNAPSHOT_LABELS[type]} - ${status}`}
            >
              {renderIcon(status)}
              <span>{SNAPSHOT_LABELS[type]}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
