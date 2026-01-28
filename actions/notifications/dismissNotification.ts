'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/database/client';

export async function dismissNotification(notificationId: string) {
  try {
    await db.dismissedNotification.create({
      data: {
        notificationId,
      },
    });

    // Revalidate pages that show notifications
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Failed to dismiss notification:', error);
    return { success: false, error: 'Failed to dismiss notification' };
  }
}
