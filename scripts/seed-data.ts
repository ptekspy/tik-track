/**
 * Seed Data Script
 * 
 * Creates sample videos, snapshots, and hashtags for development
 * 
 * Usage:
 *   pnpm seed:data
 * 
 * Environment Variables Required:
 *   - PRISMA_DATABASE_URL: Database connection string
 */

import 'dotenv/config';
import { db } from '../lib/database/client';
import { VideoStatus, SnapshotType } from '@/lib/types/server';
import { Prisma } from '@/lib/types/server';

const OWNER_EMAIL = 'pkenneally93@gmail.com';

async function seedData() {
  console.log('🌱 Starting data seed...\n');

  try {
    // Find owner user
    const owner = await db.user.findUnique({
      where: { email: OWNER_EMAIL },
    });

    if (!owner) {
      console.error(`❌ Error: Owner account not found (${OWNER_EMAIL})`);
      console.error('   Run bootstrap-owner script first: pnpm bootstrap:owner');
      process.exit(1);
    }

    console.log(`✅ Found owner: ${owner.email}\n`);

    // Create sample hashtags if they don't exist
    const hashtags = await Promise.all([
      db.hashtag.upsert({
        where: { tag: 'tiktok' },
        update: {},
        create: { tag: 'tiktok' },
      }),
      db.hashtag.upsert({
        where: { tag: 'content' },
        update: {},
        create: { tag: 'content' },
      }),
      db.hashtag.upsert({
        where: { tag: 'viral' },
        update: {},
        create: { tag: 'viral' },
      }),
      db.hashtag.upsert({
        where: { tag: 'trending' },
        update: {},
        create: { tag: 'trending' },
      }),
      db.hashtag.upsert({
        where: { tag: 'creator' },
        update: {},
        create: { tag: 'creator' },
      }),
    ]);

    console.log(`✅ Created/verified ${hashtags.length} hashtags\n`);

    // Create sample videos with dates in the past
    const now = new Date();
    const videos = [];

    // Video 1: Posted 7 days ago
    const video1Date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const video1 = await db.video.create({
      data: {
        title: 'How to Create Viral TikTok Content',
        script: 'In this video, I share my top 5 tips for creating content that goes viral on TikTok. Starting with hook strategies, transitions, and engagement tactics.',
        description: 'Learn the secrets behind viral TikTok content creation. This video covers proven strategies that helped me reach 100K followers.',
        videoLengthSeconds: 45,
        postDate: video1Date,
        status: VideoStatus.PUBLISHED,
        userId: owner.id,
      },
    });
    videos.push(video1);
    console.log(`✅ Created video: "${video1.title}"`);

    // Link hashtags to video 1
    await db.videoHashtag.createMany({
      data: [
        { videoId: video1.id, hashtagId: hashtags[0].id, position: 0 }, // tiktok
        { videoId: video1.id, hashtagId: hashtags[1].id, position: 1 }, // content
        { videoId: video1.id, hashtagId: hashtags[2].id, position: 2 }, // viral
      ],
    });

    // Create snapshots for video 1
    await db.analyticsSnapshot.createMany({
      data: [
        {
          videoId: video1.id,
          userId: owner.id,
          snapshotType: SnapshotType.ONE_HOUR,
          recordedAt: new Date(video1Date.getTime() + 1 * 60 * 60 * 1000),
          views: 1200,
          likes: 245,
          comments: 38,
          shares: 42,
          favorites: 156,
          newFollowers: 18,
          totalPlayTimeSeconds: 52400,
          avgWatchTimeSeconds: new Prisma.Decimal('42.5'),
          completionRate: new Prisma.Decimal('0.685'),
          profileViews: 340,
          reach: 2100,
        },
        {
          videoId: video1.id,
          userId: owner.id,
          snapshotType: SnapshotType.ONE_DAY,
          recordedAt: new Date(video1Date.getTime() + 24 * 60 * 60 * 1000),
          views: 8500,
          likes: 1840,
          comments: 285,
          shares: 420,
          favorites: 1250,
          newFollowers: 142,
          totalPlayTimeSeconds: 387200,
          avgWatchTimeSeconds: new Prisma.Decimal('45.5'),
          completionRate: new Prisma.Decimal('0.723'),
          profileViews: 2140,
          reach: 12400,
        },
        {
          videoId: video1.id,
          userId: owner.id,
          snapshotType: SnapshotType.SEVEN_DAY,
          recordedAt: new Date(video1Date.getTime() + 7 * 24 * 60 * 60 * 1000),
          views: 45200,
          likes: 9840,
          comments: 1520,
          shares: 2100,
          favorites: 6850,
          newFollowers: 620,
          totalPlayTimeSeconds: 2018400,
          avgWatchTimeSeconds: new Prisma.Decimal('44.7'),
          completionRate: new Prisma.Decimal('0.718'),
          profileViews: 8920,
          reach: 62100,
        },
      ],
    });
    console.log(`✅ Created 3 snapshots for video 1\n`);

    // Video 2: Posted 3 days ago
    const video2Date = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const video2 = await db.video.create({
      data: {
        title: 'Behind the Scenes: My Content Creation Setup',
        script: 'Take a look at my complete content creation setup. From cameras to lighting to editing software - everything you need to know.',
        description: 'A detailed tour of my home studio setup and the equipment I use daily to create TikTok content. Links to all products in the description.',
        videoLengthSeconds: 58,
        postDate: video2Date,
        status: VideoStatus.PUBLISHED,
        userId: owner.id,
      },
    });
    videos.push(video2);
    console.log(`✅ Created video: "${video2.title}"`);

    // Link hashtags to video 2
    await db.videoHashtag.createMany({
      data: [
        { videoId: video2.id, hashtagId: hashtags[3].id, position: 0 }, // trending
        { videoId: video2.id, hashtagId: hashtags[4].id, position: 1 }, // creator
      ],
    });

    // Create snapshots for video 2
    await db.analyticsSnapshot.createMany({
      data: [
        {
          videoId: video2.id,
          userId: owner.id,
          snapshotType: SnapshotType.ONE_HOUR,
          recordedAt: new Date(video2Date.getTime() + 1 * 60 * 60 * 1000),
          views: 2400,
          likes: 512,
          comments: 89,
          shares: 156,
          favorites: 342,
          newFollowers: 45,
          totalPlayTimeSeconds: 142800,
          avgWatchTimeSeconds: new Prisma.Decimal('59.5'),
          completionRate: new Prisma.Decimal('0.852'),
          profileViews: 720,
          reach: 4200,
        },
        {
          videoId: video2.id,
          userId: owner.id,
          snapshotType: SnapshotType.ONE_DAY,
          recordedAt: new Date(video2Date.getTime() + 24 * 60 * 60 * 1000),
          views: 15600,
          likes: 3420,
          comments: 512,
          shares: 890,
          favorites: 2340,
          newFollowers: 280,
          totalPlayTimeSeconds: 920400,
          avgWatchTimeSeconds: new Prisma.Decimal('59.0'),
          completionRate: new Prisma.Decimal('0.845'),
          profileViews: 4100,
          reach: 24500,
        },
      ],
    });
    console.log(`✅ Created 2 snapshots for video 2\n`);

    // Video 3: Posted today (draft)
    const video3Date = now;
    const video3 = await db.video.create({
      data: {
        title: 'NEW: Top 10 TikTok Trends This Week',
        script: 'Let me break down the top 10 trending sounds and formats on TikTok this week. These trends are perfect for gaining views and followers.',
        description: 'Stay up-to-date with the latest TikTok trends! In this video, I analyze and explain the top 10 trending sounds and video formats right now.',
        videoLengthSeconds: 52,
        postDate: video3Date,
        status: VideoStatus.DRAFT,
        userId: owner.id,
      },
    });
    videos.push(video3);
    console.log(`✅ Created video (DRAFT): "${video3.title}"\n`);

    // Summary
    console.log('📊 Seed Data Summary:');
    console.log(`   Videos created: ${videos.length}`);
    console.log(`   - Published: 2`);
    console.log(`   - Draft: 1`);
    console.log(`   Hashtags created: ${hashtags.length}`);
    console.log(`   Total snapshots created: 5`);
    console.log('\n✨ Seed complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit http://localhost:3000/dashboard');
    console.log('   2. You should see 3 videos with analytics');
    console.log('   3. Click on a video to see detailed snapshots and metrics');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
