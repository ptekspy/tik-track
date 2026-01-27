import { VideoForm } from '@/components/VideoForm/VideoForm';
import { createVideoAction } from '@/actions/videos/createVideoAction';

export default function NewVideoPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Video</h1>
        <p className="text-gray-600 mt-2">
          Add a new TikTok video to start tracking its performance over time.
        </p>
      </div>

      <VideoForm onSubmit={createVideoAction} />
    </div>
  );
}
