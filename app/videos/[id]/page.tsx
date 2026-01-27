import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { VideoHeader, VideoMetrics } from '@/components/videos';
import { SnapshotChart, SnapshotList } from '@/components/snapshots';
import { VideoWithSnapshots } from '@/lib/types/video';

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params;

  const video = await db.video.findUnique({
    where: { id },
    include: {
      snapshots: {
        orderBy: { recordedAt: 'asc' },
      },
    },
  }) as VideoWithSnapshots | null;

  if (!video) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <VideoHeader video={video} />

      <div className="mt-8 grid gap-8">
        <VideoMetrics video={video} />

        {video.snapshots.length > 0 && (
          <>
            <SnapshotChart snapshots={video.snapshots} />
            <SnapshotList snapshots={video.snapshots} />
          </>
        )}

        {video.snapshots.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">
              No snapshots recorded yet. Create your first snapshot to start tracking
              this video&apos;s performance.
            </p>
            <a
              href={`/videos/${video.id}/snapshots/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create First Snapshot
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
