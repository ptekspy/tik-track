import { db } from '@/lib/database/client';
import type { Channel, Prisma } from '@/lib/types/server';

/**
 * Find a channel by ID for a specific user
 */
export const findChannelById = async (id: string, userId: string): Promise<Channel | null> => {
  return db.channel.findFirst({
    where: { id, userId },
  });
};

/**
 * Find all channels for a specific user
 */
export const findAllChannels = async (userId: string): Promise<Channel[]> => {
  return db.channel.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Find a channel by handle for a specific user
 */
export const findChannelByHandle = async (handle: string, userId: string): Promise<Channel | null> => {
  return db.channel.findFirst({
    where: { handle, userId },
  });
};

/**
 * Find the default channel for a user
 */
export const findDefaultChannel = async (userId: string): Promise<Channel | null> => {
  return db.channel.findFirst({
    where: { userId, isDefault: true },
  });
};

/**
 * Create a new channel for a user
 */
export const createChannel = async (data: Prisma.ChannelCreateInput): Promise<Channel> => {
  return db.channel.create({
    data,
  });
};

/**
 * Update a channel (only if owned by user)
 */
export const updateChannel = async (
  id: string,
  data: Prisma.ChannelUpdateInput,
  userId: string
): Promise<Channel> => {
  return db.channel.update({
    where: { id, userId },
    data,
  });
};

/**
 * Delete a channel (only if owned by user)
 */
export const deleteChannel = async (id: string, userId: string): Promise<Channel> => {
  return db.channel.delete({
    where: { id, userId },
  });
};

/**
 * Set a channel as the default channel for a user
 */
export const setDefaultChannel = async (id: string, userId: string): Promise<void> => {
  // Unset all other default channels for this user
  await db.channel.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  // Set this channel as default
  await db.channel.update({
    where: { id, userId },
    data: { isDefault: true },
  });
};
