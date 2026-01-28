/**
 * Set User as Owner and Create Channel
 * 
 * Sets the specified user to OWNER role and creates their default channel
 * 
 * Usage:
 *   pnpm tsx scripts/set-owner.ts
 */

import 'dotenv/config';
import { db } from '@/lib/database/client';
import { UserRole } from '@/lib/types/server';

const OWNER_EMAIL = 'pkenneally93@gmail.com';

async function setOwner() {
  console.log('👤 Setting user to OWNER...\n');

  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email: OWNER_EMAIL },
    });

    if (!user) {
      console.error(`❌ Error: User not found (${OWNER_EMAIL})`);
      process.exit(1);
    }

    // Update user to OWNER role
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { role: UserRole.OWNER },
    });

    console.log(`✅ User set to OWNER role: ${updatedUser.email}\n`);

    // Create default channel
    const channel = await db.channel.create({
      data: {
        userId: user.id,
        name: 'Main Channel',
        handle: user.email.split('@')[0],
        bio: 'My main TikTok analytics channel',
        isDefault: true,
      },
    });

    console.log(`✅ Created default channel: "${channel.name}"\n`);
    console.log('✨ Owner setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setOwner();
