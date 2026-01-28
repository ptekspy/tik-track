/**
 * Check All Data
 * 
 * Quick script to see what data exists in the database
 */

import 'dotenv/config';
import { db } from '../lib/database/client';

async function checkAllData() {
  const owner = await db.user.findUnique({
    where: { email: 'pkenneally93@gmail.com' },
    select: { id: true, email: true, role: true }
  });

  console.log('👤 Current owner:');
  console.log(`   - ${owner?.email} (${owner?.id})`);
  console.log(`   - Role: ${owner?.role}\n`);

  // Count all data
  const videoCount = await db.video.count();
  const snapshotCount = await db.analyticsSnapshot.count();
  const notificationCount = await db.dismissedNotification.count();
  const hashtagCount = await db.hashtag.count();
  const videoHashtagCount = await db.videoHashtag.count();

  console.log('📊 Total records:');
  console.log(`   - Videos: ${videoCount}`);
  console.log(`   - Analytics Snapshots: ${snapshotCount}`);
  console.log(`   - Dismissed Notifications: ${notificationCount}`);
  console.log(`   - Hashtags: ${hashtagCount}`);
  console.log(`   - Video-Hashtag links: ${videoHashtagCount}`);

  // Check for videos with no owner
  const videosNoOwner = await db.video.count({ where: { userId: null } });
  const snapshotsNoOwner = await db.analyticsSnapshot.count({ where: { userId: null } });
  const notificationsNoOwner = await db.dismissedNotification.count({ where: { userId: null } });

  console.log('\n📊 Records without owner (userId = null):');
  console.log(`   - Videos: ${videosNoOwner}`);
  console.log(`   - Analytics Snapshots: ${snapshotsNoOwner}`);
  console.log(`   - Dismissed Notifications: ${notificationsNoOwner}`);
}

checkAllData()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
