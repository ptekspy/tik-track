'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/server';
import { updateChannel, findChannelById } from '@/lib/dal/channels';

interface UpdateChannelInput {
  name: string;
  handle: string;
  bio?: string;
}

export async function updateChannelAction(channelId: string, input: UpdateChannelInput) {
  const user = await requireUser();

  try {
    // Verify user owns this channel
    const channel = await findChannelById(channelId, user.id);
    if (!channel) {
      throw new Error('Channel not found');
    }

    const updated = await updateChannel(
      channelId,
      {
        name: input.name,
        handle: input.handle,
        bio: input.bio || null,
      },
      user.id
    );

    revalidatePath('/channels');
    revalidatePath('/dashboard');

    return updated;
  } catch (error) {
    console.error('Failed to update channel:', error);
    throw new Error('Failed to update channel');
  }
}
