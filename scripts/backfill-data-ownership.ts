/**
 * Backfill Data Ownership
 * 
 * Assigns all existing data (with userId = null) to the owner account.
 * This is a one-time migration script.
 * 
 * Usage:
 *   tsx scripts/backfill-data-ownership.ts
 * 
 * Environment Variables Required:
 *   - PRISMA_DATABASE_URL: Database connection string
 * 
 * Safety Features:
 *   - Aborts if no owner user exists
 *   - Aborts if multiple users exist (use --force to override)
 *   - Runs in transaction for data integrity
 *   - Provides before/after counts
 */

import { db } from '../lib/database/client';
import { UserRole } from '../lib/types/server';

const OWNER_EMAIL = 'pkenneally93@gmail.com';
const FORCE_MODE = process.argv.includes('--force');

interface BackfillStats {
  table: string;
  before: number;
  after: number;
  assigned: number;
}

async function backfillOwnership() {
  console.log('🔄 Starting data ownership backfill...\n');

  const stats: BackfillStats[] = [];

  try {
    // Find owner user
    const owner = await db.user.findUnique({
      where: { email: OWNER_EMAIL },
    });

    if (!owner) {
      console.error(`❌ Error: Owner account not found (${OWNER_EMAIL})`);
      console.error('   Run bootstrap-owner script first: npm run bootstrap:owner');
      process.exit(1);
    }

    if (owner.role !== UserRole.OWNER) {
      console.error(`❌ Error: User ${OWNER_EMAIL} exists but is not an OWNER`);
      console.error(`   Current role: ${owner.role}`);
      process.exit(1);
    }

    console.log(`✅ Found owner account: ${owner.email} (${owner.id})\n`);

    // Safety check: count total users
    const totalUsers = await db.user.count();
    if (totalUsers > 1 && !FORCE_MODE) {
      console.error(`⚠️  Warning: Multiple users detected (${totalUsers} total)`);
      console.error('   This backfill is designed for single-user initial setup.');
      console.error('   Use --force flag if you want to proceed anyway.');
      console.error('\n   Usage: tsx scripts/backfill-data-ownership.ts --force');
      process.exit(1);
    }

    // Count orphaned records before backfill
    const videosWithoutOwner = await db.video.count({ where: { userId: null } });
    const snapshotsWithoutOwner = await db.analyticsSnapshot.count({ where: { userId: null } });
    const notificationsWithoutOwner = await db.dismissedNotification.count({ where: { userId: null } });

    console.log('📊 Orphaned records found:');
    console.log(`   Videos: ${videosWithoutOwner}`);
    console.log(`   Snapshots: ${snapshotsWithoutOwner}`);
    console.log(`   Dismissed Notifications: ${notificationsWithoutOwner}`);
    console.log();

    if (videosWithoutOwner === 0 && snapshotsWithoutOwner === 0 && notificationsWithoutOwner === 0) {
      console.log('✨ No orphaned records found - all data already has ownership!');
      console.log('   Backfill complete (nothing to do).');
      return;
    }

    console.log('🔧 Starting backfill transaction...\n');

    // Backfill in transaction
    await db.$transaction(async (tx) => {
      // Backfill Videos
      if (videosWithoutOwner > 0) {
        const result = await tx.video.updateMany({
          where: { userId: null },
          data: { userId: owner.id },
        });
        stats.push({
          table: 'Video',
          before: videosWithoutOwner,
          after: 0,
          assigned: result.count,
        });
        console.log(`   ✓ Assigned ${result.count} videos to owner`);
      }

      // Backfill AnalyticsSnapshots
      if (snapshotsWithoutOwner > 0) {
        const result = await tx.analyticsSnapshot.updateMany({
          where: { userId: null },
          data: { userId: owner.id },
        });
        stats.push({
          table: 'AnalyticsSnapshot',
          before: snapshotsWithoutOwner,
          after: 0,
          assigned: result.count,
        });
        console.log(`   ✓ Assigned ${result.count} snapshots to owner`);
      }

      // Backfill DismissedNotifications
      if (notificationsWithoutOwner > 0) {
        const result = await tx.dismissedNotification.updateMany({
          where: { userId: null },
          data: { userId: owner.id },
        });
        stats.push({
          table: 'DismissedNotification',
          before: notificationsWithoutOwner,
          after: 0,
          assigned: result.count,
        });
        console.log(`   ✓ Assigned ${result.count} notifications to owner`);
      }
    });

    console.log('\n✅ Backfill complete!\n');

    // Summary
    console.log('📈 Summary:');
    console.log('   ┌─────────────────────────┬────────┬──────────┐');
    console.log('   │ Table                   │ Before │ Assigned │');
    console.log('   ├─────────────────────────┼────────┼──────────┤');
    for (const stat of stats) {
      const table = stat.table.padEnd(23);
      const before = String(stat.before).padStart(6);
      const assigned = String(stat.assigned).padStart(8);
      console.log(`   │ ${table} │ ${before} │ ${assigned} │`);
    }
    console.log('   └─────────────────────────┴────────┴──────────┘');

    const totalAssigned = stats.reduce((sum, s) => sum + s.assigned, 0);
    console.log(`\n   Total records assigned: ${totalAssigned}`);
    console.log(`   Owner: ${owner.email}`);

  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    throw error;
  }
}

// Run the backfill
backfillOwnership()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Backfill failed:', error);
    process.exit(1);
  });
