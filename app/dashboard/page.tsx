import { db } from '@/lib/database/client';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { VideoWithSnapshots } from '@/lib/types/video';
import Link from 'next/link';

export default async function DashboardPage() {
  const videos = await db.video.findMany({
    include: { snapshots: true },
    orderBy: { createdAt: 'desc' },
  }) as VideoWithSnapshots[];

  // Calculate aggregate stats
  const stats = {
    totalVideos: videos.length,
    publishedVideos: videos.filter(v => v.status === 'PUBLISHED').length,
    draftVideos: videos.filter(v => v.status === 'DRAFT').length,
    archivedVideos: videos.filter(v => v.status === 'ARCHIVED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track and analyze your TikTok video performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Videos</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalVideos}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Published</div>
          <div className="text-3xl font-bold text-green-600">{stats.publishedVideos}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Drafts</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.draftVideos}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Archived</div>
          <div className="text-3xl font-bold text-gray-600">{stats.archivedVideos}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          href="/videos/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          + New Video
        </Link>
      </div>

      {/* Videos Grid */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Videos
        </h2>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No videos yet</p>
            <Link
              href="/videos/new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first video
            </Link>
          </div>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </div>
  );
}
