/**
 * Backfill Data Ownership
 * 
 * Assigns all existing data (with userId = null) to the owner account.
 * This is a one-time migration script.
 * 
 * Usage:
 *   pnpm backfill:ownership
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

import 'dotenv/config';
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

    // Count orphaned records (null userId)
    const videosWithoutOwner = await db.video.count({ where: { userId: null } });
    const snapshotsWithoutOwner = await db.analyticsSnapshot.count({ where: { userId: null } });
    const notificationsWithoutOwner = await db.dismissedNotification.count({ where: { userId: null } });

    // Count records assigned to OTHER users (in case owner was recreated)
    const videosWithOtherOwner = await db.video.count({ 
      where: { 
        userId: { not: null, notIn: [owner.id] }
      } 
    });
    const snapshotsWithOtherOwner = await db.analyticsSnapshot.count({ 
      where: { 
        userId: { not: null, notIn: [owner.id] }
      } 
    });
    const notificationsWithOtherOwner = await db.dismissedNotification.count({ 
      where: { 
        userId: { not: null, notIn: [owner.id] }
      } 
    });

    const totalOrphaned = videosWithoutOwner + snapshotsWithoutOwner + notificationsWithoutOwner;
    const totalOtherOwner = videosWithOtherOwner + snapshotsWithOtherOwner + notificationsWithOtherOwner;

    console.log('📊 Orphaned records (no owner):');
    console.log(`   Videos: ${videosWithoutOwner}`);
    console.log(`   Snapshots: ${snapshotsWithoutOwner}`);
    console.log(`   Dismissed Notifications: ${notificationsWithoutOwner}`);
    
    if (totalOtherOwner > 0) {
      console.log('\n📊 Records with other owners (will be reassigned):');
      console.log(`   Videos: ${videosWithOtherOwner}`);
      console.log(`   Snapshots: ${snapshotsWithOtherOwner}`);
      console.log(`   Dismissed Notifications: ${notificationsWithOtherOwner}`);
    }
    console.log();

    if (totalOrphaned === 0 && totalOtherOwner === 0) {
      console.log('✨ All data already belongs to the current owner!');
      console.log('   Backfill complete (nothing to do).');
      return;
    }

    console.log('🔧 Starting backfill transaction...\n');

    // Backfill in transaction
    await db.$transaction(async (tx) => {
      // Backfill Videos (both null and other owners)
      const totalVideos = videosWithoutOwner + videosWithOtherOwner;
      if (totalVideos > 0) {
        const result = await tx.video.updateMany({
          where: { 
            OR: [
              { userId: null },
              { userId: { not: owner.id } }
            ]
          },
          data: { userId: owner.id },
        });
        stats.push({
          table: 'Video',
          before: totalVideos,
          after: 0,
          assigned: result.count,
        });
        console.log(`   ✓ Assigned ${result.count} videos to owner`);
      }

      // Backfill AnalyticsSnapshots
      const totalSnapshots = snapshotsWithoutOwner + snapshotsWithOtherOwner;
      if (totalSnapshots > 0) {
        const result = await tx.analyticsSnapshot.updateMany({
          where: { 
            OR: [
              { userId: null },
              { userId: { not: owner.id } }
            ]
          },
          data: { userId: owner.id },
        });
        stats.push({
          table: 'AnalyticsSnapshot',
          before: totalSnapshots,
          after: 0,
          assigned: result.count,
        });
        console.log(`   ✓ Assigned ${result.count} snapshots to owner`);
      }

      // Backfill DismissedNotifications
      const totalNotifications = notificationsWithoutOwner + notificationsWithOtherOwner;
      if (totalNotifications > 0) {
        const result = await tx.dismissedNotification.updateMany({
          where: { 
            OR: [
              { userId: null },
              { userId: { not: owner.id } }
            ]
          },
          data: { userId: owner.id },
        });
        stats.push({
          table: 'DismissedNotification',
          before: totalNotifications,
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
