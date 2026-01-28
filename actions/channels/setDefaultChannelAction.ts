'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/server';
import { setDefaultChannel, findChannelById } from '@/lib/dal/channels';

export async function setDefaultChannelAction(channelId: string) {
  const user = await requireUser();

  try {
    // Verify user owns this channel
    const channel = await findChannelById(channelId, user.id);
    if (!channel) {
      throw new Error('Channel not found');
    }

    await setDefaultChannel(channelId, user.id);

    revalidatePath('/channels');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to set default channel:', error);
    throw new Error('Failed to set default channel');
  }
}
