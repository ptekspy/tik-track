import { VideoForm } from '@/components/VideoForm/VideoForm';
import { createVideoAction } from '@/actions/videos/createVideoAction';
import { Video, Plus } from 'lucide-react';

export default function NewVideoPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <Plus className="w-8 h-8 text-[#fe2c55]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent">
            Create New Video
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Add a new TikTok video to start tracking its performance over time.
        </p>
      </div>

      <VideoForm onSubmit={createVideoAction} />
    </div>
  );
}
