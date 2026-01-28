import { findVideosByStatus } from '@/lib/dal/videos';
import { VideoStatus } from '@/lib/constants';
import { NavigationClient } from './NavigationClient';
import { getNotifications } from '@/lib/notifications/getNotifications';
import { getUser } from '@/lib/auth/server';
import { findAllChannels, findDefaultChannel } from '@/lib/dal/channels';

export async function Navigation() {
  try {
    // Get authenticated user (returns null if not authenticated)
    const user = await getUser();
    
    // Only render navigation for authenticated users
    if (!user) {
      return null;
    }
    
    // Fetch draft count for badge
    const draftVideos = await findVideosByStatus(VideoStatus.DRAFT, user.id);
    const draftCount = draftVideos.length;

    // Fetch notifications
    const notifications = await getNotifications();

    // Fetch user's channels
    const channels = await findAllChannels(user.id);
    const defaultChannel = await findDefaultChannel(user.id);
    const currentChannelId = defaultChannel?.id || channels[0]?.id || '';

    return (
      <NavigationClient
        draftCount={draftCount}
        notifications={notifications}
        channels={channels}
        currentChannelId={currentChannelId}
      />
    );
  } catch (error) {
    console.error('Navigation error:', error);
    return null;
  }
}
