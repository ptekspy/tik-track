import { db } from '@/lib/database/client';
import { VideoStatus } from '@/lib/types/server';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { VideoWithSnapshots } from '@/lib/types/video';
import Link from 'next/link';
import { FileEdit, Plus } from 'lucide-react';

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
        <div className="flex items-center space-x-3 mb-3">
          <FileEdit className="w-8 h-8 text-[#fe2c55]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Draft Videos
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Videos waiting to be published
        </p>
      </div>

      {/* Content */}
      {draftVideos.length === 0 ? (
        <div className="glass rounded-2xl p-16 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full mb-6">
            <FileEdit className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-gray-900 dark:text-white text-xl font-semibold mb-2">No draft videos</p>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            All your videos are either published or archived
          </p>
          <Link
            href="/videos/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all btn-glow"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Video</span>
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {draftVideos.length} draft{draftVideos.length === 1 ? '' : 's'} found
              </p>
            </div>
            <Link
              href="/videos/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all btn-glow text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Video</span>
            </Link>
          </div>
          <VideoGrid videos={draftVideos} />
        </div>
      )}
    </div>
  );
}
