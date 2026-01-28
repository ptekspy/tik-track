import { db } from '@/lib/database/client';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { VideoWithSnapshots } from '@/lib/types/video';
import Link from 'next/link';
import { TrendingUp, Video, FileEdit, Archive, Plus, Sparkles } from 'lucide-react';

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
        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-[#fe2c55]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Track and analyze your TikTok video performance in real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Videos Card */}
        <div className="group relative card-hover">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-[#fe2c55] to-[#7c3aed] p-3 rounded-xl">
                <Video className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Videos</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalVideos}</div>
          </div>
        </div>

        {/* Published Card */}
        <div className="group relative card-hover">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Published</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.publishedVideos}</div>
          </div>
        </div>

        {/* Drafts Card */}
        <div className="group relative card-hover">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-3 rounded-xl">
                <FileEdit className="w-6 h-6 text-white" />
              </div>
              {stats.draftVideos > 0 && (
                <span className="bg-[#25f4ee] text-[#0f0f23] text-xs font-bold px-2 py-1 rounded-full">
                  {stats.draftVideos}
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Drafts</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.draftVideos}</div>
          </div>
        </div>

        {/* Archived Card */}
        <div className="group relative card-hover">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-gray-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-slate-400 to-gray-600 p-3 rounded-xl">
                <Archive className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Archived</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.archivedVideos}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          href="/videos/new"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all btn-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Video</span>
        </Link>
      </div>

      {/* Videos Grid */}
      <div className="glass rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-[#fe2c55] to-[#7c3aed] rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Videos
          </h2>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fe2c55]/20 to-[#7c3aed]/20 rounded-full mb-4">
              <Video className="w-8 h-8 text-[#fe2c55]" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">No videos yet</p>
            <Link
              href="/videos/new"
              className="inline-flex items-center space-x-2 text-[#fe2c55] hover:text-[#7c3aed] font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create your first video</span>
            </Link>
          </div>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </div>
  );
}
