'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/server';
import { createChannel, findAllChannels } from '@/lib/dal/channels';

interface CreateChannelInput {
  name: string;
  handle: string;
  bio?: string;
}

export async function createChannelAction(input: CreateChannelInput) {
  const user = await requireUser();

  try {
    // If this is the first channel, make it default
    const allChannels = await findAllChannels(user.id);
    const isDefault = allChannels.length === 0;

    const channel = await createChannel({
      user: { connect: { id: user.id } },
      name: input.name,
      handle: input.handle,
      bio: input.bio || null,
      isDefault,
    });

    revalidatePath('/channels');
    revalidatePath('/dashboard');

    return channel;
  } catch (error) {
    console.error('Failed to create channel:', error);
    throw new Error('Failed to create channel');
  }
}
