import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/server';
import { findAllChannels } from '@/lib/dal/channels';
import { ChannelsPageClient } from './ChannelsPageClient';

export default async function ChannelsPage() {
  const user = await requireUser();
  const channels = await findAllChannels(user.id);

  return <ChannelsPageClient channels={channels} userId={user.id} />;
}
