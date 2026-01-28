import { findVideosByStatus } from '@/lib/dal/videos';
import { VideoStatus } from '@/lib/constants';
import { NavigationClient } from './NavigationClient';
import { getNotifications } from '@/lib/notifications/getNotifications';

export async function Navigation() {
  // Fetch draft count for badge
  const draftVideos = await findVideosByStatus(VideoStatus.DRAFT);
  const draftCount = draftVideos.length;

  // Fetch notifications
  const notifications = await getNotifications();

  return <NavigationClient draftCount={draftCount} notifications={notifications} />;
}
