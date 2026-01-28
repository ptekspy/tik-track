'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/server';
import { deleteChannel, findChannelById } from '@/lib/dal/channels';

export async function deleteChannelAction(channelId: string) {
  const user = await requireUser();

  try {
    // Verify user owns this channel
    const channel = await findChannelById(channelId, user.id);
    if (!channel) {
      throw new Error('Channel not found');
    }

    // Prevent deleting the default channel
    if (channel.isDefault) {
      throw new Error('Cannot delete the default channel');
    }

    await deleteChannel(channelId, user.id);

    revalidatePath('/channels');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to delete channel:', error);
    throw new Error('Failed to delete channel');
  }
}
