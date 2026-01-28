#!/usr/bin/env tsx

/**
 * Clear Production Database
 * 
 * WARNING: This will delete ALL data from your production database!
 * Use with caution.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearProductionDatabase() {
  try {
    console.log('⚠️  WARNING: This will delete ALL data from your production database!');
    console.log('Database URL:', process.env.PRISMA_DATABASE_URL?.substring(0, 50) + '...');
    console.log('\nStarting in 5 seconds... Press Ctrl+C to cancel.');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🗑️  Clearing database...\n');

    // Delete in order to respect foreign key constraints
    console.log('Deleting VideoHashtag records...');
    const videoHashtagCount = await prisma.videoHashtag.deleteMany({});
    console.log(`✓ Deleted ${videoHashtagCount.count} VideoHashtag records`);

    console.log('Deleting AnalyticsSnapshot records...');
    const snapshotCount = await prisma.analyticsSnapshot.deleteMany({});
    console.log(`✓ Deleted ${snapshotCount.count} AnalyticsSnapshot records`);

    console.log('Deleting Video records...');
    const videoCount = await prisma.video.deleteMany({});
    console.log(`✓ Deleted ${videoCount.count} Video records`);

    console.log('Deleting Hashtag records...');
    const hashtagCount = await prisma.hashtag.deleteMany({});
    console.log(`✓ Deleted ${hashtagCount.count} Hashtag records`);

    console.log('\n✅ Production database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearProductionDatabase();
