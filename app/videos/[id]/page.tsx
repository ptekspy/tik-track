import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { VideoHeader, VideoMetrics } from '@/components/videos';
import { SnapshotChart, SnapshotList } from '@/components/snapshots';
import { VideoWithSnapshots, SerializedVideoWithSnapshots } from '@/lib/types/video';
import { requireUser } from '@/lib/auth/server';

// Force dynamic rendering - snapshots change frequently
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params;
  
  // Get authenticated user
  const user = await requireUser();

  // Get video only if owned by this user
  const video = await db.video.findFirst({
    where: { id, userId: user.id },
    include: {
      snapshots: {
        orderBy: { recordedAt: 'asc' },
      },
    },
  }) as VideoWithSnapshots | null;

  if (!video) {
    notFound();
  }

  // Serialize Decimal values for client components
  const serializedVideo: SerializedVideoWithSnapshots = {
    ...video,
    snapshots: video.snapshots.map(snapshot => ({
      ...snapshot,
      avgWatchTimeSeconds: snapshot.avgWatchTimeSeconds ? Number(snapshot.avgWatchTimeSeconds) : null,
      completionRate: snapshot.completionRate ? Number(snapshot.completionRate) : null,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <VideoHeader video={serializedVideo} />

      <div className="mt-8 grid gap-8">
        <VideoMetrics video={serializedVideo} />

        {serializedVideo.snapshots.length > 0 && (
          <>
            <SnapshotChart snapshots={serializedVideo.snapshots} />
            <SnapshotList snapshots={serializedVideo.snapshots} />
          </>
        )}

        {serializedVideo.snapshots.length === 0 && (
          <div className="glass rounded-2xl border border-white/20 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fe2c55]/20 to-[#7c3aed]/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-[#fe2c55]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              No snapshots recorded yet. Create your first snapshot to start tracking
              this video&apos;s performance.
            </p>
            <a
              href={`/videos/${video.id}/snapshots/new`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all btn-glow"
            >
              Create First Snapshot
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
