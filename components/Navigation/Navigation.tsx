import { findVideosByStatus } from '@/lib/dal/videos';
import { VideoStatus } from '@/lib/constants';
import { NavigationClient } from './NavigationClient';

export async function Navigation() {
  // Fetch draft count for badge
  const draftVideos = await findVideosByStatus(VideoStatus.DRAFT);
  const draftCount = draftVideos.length;

  return <NavigationClient draftCount={draftCount} />;
}
