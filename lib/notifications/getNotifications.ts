import { db } from '@/lib/database/client';
import { VideoStatus } from '@/lib/types/server';
import { getMissedSnapshots } from '@/lib/snapshots/getMissedSnapshots';
import { getNextSuggestedSnapshot } from '@/lib/snapshots/getNextSuggestedSnapshot';
import { calculateSignal } from '@/lib/metrics/calculateSignal';
import type { VideoWithSnapshots } from '@/lib/types/video';

export type NotificationType = 
  | 'missed_snapshot' 
  | 'upcoming_snapshot' 
  | 'positive_signal'
  | 'underperforming';

export interface Notification {
  id: string;
  type: NotificationType;
  videoId: string;
  videoTitle: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
  priority: number; // Higher = more important
  timestamp: Date;
}

/**
 * Get all actionable notifications for the user
 */
export async function getNotifications(): Promise<Notification[]> {
  const notifications: Notification[] = [];
  
  // Get all published videos with snapshots
  const videos = await db.video.findMany({
    where: { status: VideoStatus.PUBLISHED },
    include: { snapshots: true },
    orderBy: { postDate: 'desc' },
  }) as VideoWithSnapshots[];

  const now = new Date();

  for (const video of videos) {
    if (!video.postDate) continue;

    const existingTypes = video.snapshots.map(s => s.snapshotType);

    // Check for missed snapshots
    const missedTypes = getMissedSnapshots(video.postDate, existingTypes);
    for (const missedType of missedTypes) {
      const label = missedType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      notifications.push({
        id: `missed-${video.id}-${missedType}`,
        type: 'missed_snapshot',
        videoId: video.id,
        videoTitle: video.title,
        message: `You missed the ${label} snapshot window for "${video.title}"`,
        actionLabel: 'Add Late Snapshot',
        actionUrl: `/videos/${video.id}/snapshots/new`,
        priority: 10, // High priority
        timestamp: new Date(), // Use current time for missed snapshots
      });
    }

    // Check for positive signals (recent good performance)
    if (video.snapshots.length >= 2) {
      const sortedSnapshots = [...video.snapshots].sort(
        (a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()
      );
      const latestSnapshot = sortedSnapshots[0];
      const previousSnapshot = sortedSnapshots[1];

      const signal = calculateSignal(latestSnapshot as any, previousSnapshot as any);
      
      // Only notify for strong positive signals on recent videos
      const daysSincePost = (now.getTime() - video.postDate.getTime()) / (1000 * 60 * 60 * 24);
      if (signal === 'positive' && daysSincePost <= 7) {
        notifications.push({
          id: `signal-${video.id}`,
          type: 'positive_signal',
          videoId: video.id,
          videoTitle: video.title,
          message: `"${video.title}" is performing well! Consider creating follow-up content`,
          actionLabel: 'View Details',
          actionUrl: `/videos/${video.id}`,
          priority: 5,
          timestamp: latestSnapshot.recordedAt,
        });
      }
    }
  }

  // Sort by priority (highest first), then by timestamp (most recent first)
  return notifications.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
}
