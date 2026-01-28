/**
 * Reset Owner Account
 * 
 * Deletes the owner account so it can be recreated with proper password hashing.
 * Only use this during initial setup or if password hashing needs to be fixed.
 * 
 * Usage:
 *   pnpm tsx scripts/reset-owner.ts
 */

import 'dotenv/config';
import { db } from '../lib/database/client';

const OWNER_EMAIL = 'pkenneally93@gmail.com';

async function resetOwner() {
  console.log('🔄 Resetting owner account...\n');

  try {
    // Find owner user
    const owner = await db.user.findUnique({
      where: { email: OWNER_EMAIL },
      include: {
        accounts: true,
        sessions: true,
      },
    });

    if (!owner) {
      console.log(`⚠️  No owner account found with email: ${OWNER_EMAIL}`);
      console.log('   Nothing to reset.');
      return;
    }

    console.log(`Found owner account: ${owner.email} (${owner.id})`);
    console.log(`   Accounts: ${owner.accounts.length}`);
    console.log(`   Sessions: ${owner.sessions.length}`);
    console.log('\n🗑️  Deleting owner account and related data...\n');

    // Delete user (cascade will handle accounts and sessions)
    await db.user.delete({
      where: { id: owner.id },
    });

    console.log('✅ Owner account deleted successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: pnpm bootstrap:owner');
    console.log('   2. Your data will remain (videos/snapshots already assigned)');
    console.log('   3. Log in with the new account');
    
  } catch (error) {
    console.error('❌ Error resetting owner account:', error);
    throw error;
  }
}

// Run the reset
resetOwner()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Reset failed:', error);
    process.exit(1);
  });
