import type { Video, AnalyticsSnapshot } from '@/lib/generated/client';
import { VideoCard } from '@/components/VideoCard/VideoCard';

export interface VideoGridProps {
  videos: (Video & { snapshots: AnalyticsSnapshot[] })[];
  emptyMessage?: string;
}

/**
 * VideoGrid Component
 * 
 * Responsive grid layout for displaying video cards.
 */
export function VideoGrid({ videos, emptyMessage = 'No videos found' }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
