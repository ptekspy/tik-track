import { db } from '@/lib/database/client';
import { VideoStatus } from '@/lib/types/server';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { VideoWithSnapshots } from '@/lib/types/video';
import Link from 'next/link';

export default async function DraftsPage() {
  const draftVideos = await db.video.findMany({
    where: { status: VideoStatus.DRAFT },
    include: { snapshots: true },
    orderBy: { createdAt: 'desc' },
  }) as VideoWithSnapshots[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Draft Videos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Videos waiting to be published
        </p>
      </div>

      {/* Content */}
      {draftVideos.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg mb-4">No draft videos</p>
          <p className="text-gray-400 mb-6">
            All your videos are either published or archived
          </p>
          <Link
            href="/videos/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            + Create New Video
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {draftVideos.length} draft{draftVideos.length === 1 ? '' : 's'} found
            </p>
            <Link
              href="/videos/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
            >
              + New Video
            </Link>
          </div>
          <VideoGrid videos={draftVideos} />
        </div>
      )}
    </div>
  );
}
