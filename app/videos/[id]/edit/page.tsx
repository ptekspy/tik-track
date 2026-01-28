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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Video</h1>
        <p className="text-gray-600 mt-2">
          Update the details and metadata for this video.
        </p>
      </div>

      <VideoForm defaultValues={defaultValues} onSubmit={handleSubmit(video.id)} />
    </div>
  );
}
