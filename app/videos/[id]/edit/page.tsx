import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { VideoForm, VideoFormData } from '@/components/VideoForm/VideoForm';
import { updateVideoAction } from '@/actions/videos/updateVideoAction';
import { VideoWithSnapshots } from '@/lib/types/video';

interface VideoEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoEditPage({ params }: VideoEditPageProps) {
  const { id } = await params;

  const video = await db.video.findUnique({
    where: { id },
    include: {
      snapshots: true,
      hashtags: {
        include: { hashtag: true }
      },
    },
  }) as (VideoWithSnapshots & { hashtags: { hashtag: { tag: string } }[] }) | null;

  if (!video) {
    notFound();
  }

  const handleSubmit = (videoId: string) => async (data: VideoFormData) => {
    'use server';
    await updateVideoAction(videoId, data);
  };

  const defaultValues: Partial<VideoFormData> = {
    title: video.title,
    script: video.script,
    description: video.description || '',
    videoLengthSeconds: video.videoLengthSeconds,
    status: video.status,
    postDate: video.postDate?.toISOString(),
    hashtags: video.hashtags.map(h => h.hashtag.tag),
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-4xl">✏️</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent">
            Edit Video
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Update the details and metadata for this video.
        </p>
      </div>

      <VideoForm defaultValues={defaultValues} onSubmit={handleSubmit(video.id)} />
    </div>
  );
}
