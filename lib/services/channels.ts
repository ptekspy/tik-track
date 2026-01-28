import { requireUser } from '@/lib/auth/server';
import {
  findChannelById,
  findAllChannels,
  findDefaultChannel,
  findChannelByHandle,
  createChannel as createChannelDAL,
  updateChannel as updateChannelDAL,
  deleteChannel as deleteChannelDAL,
  setDefaultChannel as setDefaultChannelDAL,
} from '@/lib/dal/channels';
import type { Channel } from '@/lib/types/server';

/**
 * Get all channels for the authenticated user
 */
export const getAllChannels = async (): Promise<Channel[]> => {
  const user = await requireUser();
  return findAllChannels(user.id);
};

/**
 * Get a specific channel
 */
export const getChannel = async (channelId: string): Promise<Channel> => {
  const user = await requireUser();
  const channel = await findChannelById(channelId, user.id);
  
  if (!channel) {
    throw new Error(`Channel with ID ${channelId} not found`);
  }
  
  return channel;
};

/**
 * Get the default channel for the authenticated user
 */
export const getDefaultChannel = async (): Promise<Channel> => {
  const user = await requireUser();
  const channel = await findDefaultChannel(user.id);
  
  if (!channel) {
    throw new Error('No default channel found for user');
  }
  
  return channel;
};

/**
 * Create a new channel for the authenticated user
 */
export const createChannel = async (input: {
  name: string;
  handle: string;
  bio?: string;
  avatar?: string;
}): Promise<Channel> => {
  const user = await requireUser();
  
  // Check if handle is already taken
  const existingChannel = await findChannelByHandle(input.handle, user.id);
  if (existingChannel) {
    throw new Error(`Channel handle "${input.handle}" is already in use`);
  }
  
  // If this is the first channel, make it default
  const allChannels = await findAllChannels(user.id);
  const isDefault = allChannels.length === 0;
  
  return createChannelDAL({
    user: { connect: { id: user.id } },
    name: input.name,
    handle: input.handle,
    bio: input.bio || null,
    avatar: input.avatar || null,
    isDefault,
  });
};

/**
 * Update a channel
 */
export const updateChannel = async (
  channelId: string,
  input: {
    name?: string;
    bio?: string;
    avatar?: string;
  }
): Promise<Channel> => {
  const user = await requireUser();
  
  return updateChannelDAL(channelId, input, user.id);
};

/**
 * Delete a channel (and reassign videos if needed)
 */
export const deleteChannel = async (channelId: string): Promise<void> => {
  const user = await requireUser();
  
  const channel = await findChannelById(channelId, user.id);
  if (!channel) {
    throw new Error('Channel not found');
  }
  
  if (channel.isDefault) {
    throw new Error('Cannot delete default channel. Set another channel as default first.');
  }
  
  await deleteChannelDAL(channelId, user.id);
};

/**
 * Set a channel as the default channel
 */
export const setDefaultChannel = async (channelId: string): Promise<void> => {
  const user = await requireUser();
  await setDefaultChannelDAL(channelId, user.id);
};
