/**
 * Check Videos
 * 
 * Quick script to see what videos exist and their ownership
 */

import 'dotenv/config';
import { db } from '../lib/database/client';

async function checkVideos() {
  const videos = await db.video.findMany({
    select: {
      id: true,
      title: true,
      userId: true,
    }
  });

  console.log('📹 Videos in database:');
  videos.forEach(v => {
    console.log(`   - ${v.title} (userId: ${v.userId})`);
  });

  const owner = await db.user.findUnique({
    where: { email: 'pkenneally93@gmail.com' },
    select: { id: true, email: true, role: true }
  });

  console.log('\n👤 Current owner:');
  console.log(`   - ${owner?.email} (${owner?.id})`);
  console.log(`   - Role: ${owner?.role}`);

  // Check for videos not belonging to this owner
  const videosWithOtherOwner = await db.video.count({ 
    where: { 
      userId: { not: null, notIn: [owner?.id || ''] }
    } 
  });

  console.log('\n🔍 Statistics:');
  console.log(`   - Videos with other owner: ${videosWithOtherOwner}`);
  console.log(`   - Videos without owner (null): ${await db.video.count({ where: { userId: null } })}`);
}

checkVideos()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
