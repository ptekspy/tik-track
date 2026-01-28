import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { SnapshotForm, SnapshotFormData } from '@/components/SnapshotForm/SnapshotForm';
import { createSnapshotAction } from '@/actions/snapshots/createSnapshotAction';
import { getExpectedSnapshots } from '@/lib/snapshots/getExpectedSnapshots';

interface NewSnapshotPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewSnapshotPage({ params }: NewSnapshotPageProps) {
  const { id } = await params;

  const video = await db.video.findUnique({
    where: { id },
    include: {
      snapshots: true,
    },
  });

  if (!video || !video.postDate) {
    notFound();
  }

  const handleSubmit = (videoId: string) => async (data: SnapshotFormData) => {
    'use server';
    await createSnapshotAction(videoId, data);
  };

  const availableTypes = getExpectedSnapshots(video.postDate);

  const latestSnapshot = video.snapshots.length > 0
    ? [...video.snapshots].sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())[0]
    : null;

  const previousSnapshot = latestSnapshot ? {
    snapshotType: latestSnapshot.snapshotType,
    views: latestSnapshot.views ?? undefined,
    likes: latestSnapshot.likes ?? undefined,
    comments: latestSnapshot.comments ?? undefined,
    shares: latestSnapshot.shares ?? undefined,
  } : null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Snapshot</h1>
        <p className="text-gray-600 mt-2">
          Record current metrics for &quot;{video.title}&quot;
        </p>
      </div>

      <SnapshotForm 
        videoId={video.id} 
        availableTypes={availableTypes}
        previousSnapshot={previousSnapshot}
        onSubmit={handleSubmit(video.id)} 
      />
    </div>
  );
}
