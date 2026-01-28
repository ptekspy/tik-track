import { findVideosByStatus } from '@/lib/dal/videos';
import { VideoStatus } from '@/lib/constants';
import { NavigationClient } from './NavigationClient';
import { getNotifications } from '@/lib/notifications/getNotifications';
import { requireUser } from '@/lib/auth/server';

export async function Navigation() {
  // Get authenticated user
  const user = await requireUser();
  
  // Fetch draft count for badge
  const draftVideos = await findVideosByStatus(VideoStatus.DRAFT, user.id);
  const draftCount = draftVideos.length;

  // Fetch notifications
  const notifications = await getNotifications();

  return <NavigationClient draftCount={draftCount} notifications={notifications} />;
}
