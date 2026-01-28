import { PrismaClient } from '@prisma/client';

// Create a separate Prisma client for test database
const getTestDb = () => {
  const testDatabaseUrl = process.env.PRISMA_DATABASE_URL;
  
  if (!testDatabaseUrl) {
    throw new Error('PRISMA_DATABASE_URL not found in environment variables');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });
};

/**
 * Clean all data from the test database
 */
export const cleanDatabase = async () => {
  const db = getTestDb();
  
  try {
    // Delete in correct order to respect foreign key constraints
    await db.analyticsSnapshot.deleteMany({});
    await db.videoHashtag.deleteMany({});
    await db.hashtag.deleteMany({});
    await db.video.deleteMany({});
    
    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
};

/**
 * Seed the database with test data
 */
export const seedDatabase = async (data?: {
  videos?: any[];
  hashtags?: any[];
  snapshots?: any[];
}) => {
  const db = getTestDb();
  
  try {
    if (data?.hashtags) {
      for (const hashtag of data.hashtags) {
        await db.hashtag.create({ data: hashtag });
      }
    }

    if (data?.videos) {
      for (const video of data.videos) {
        await db.video.create({ data: video });
      }
    }

    if (data?.snapshots) {
      for (const snapshot of data.snapshots) {
        await db.analyticsSnapshot.create({ data: snapshot });
      }
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
};

/**
 * Create a test video with optional snapshots and hashtags
 */
export const createTestVideo = async (data: {
  title: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  postDate?: Date;
  videoLengthSeconds?: number;
  snapshots?: any[];
  hashtags?: string[];
}) => {
  const db = getTestDb();
  
  try {
    const video = await db.video.create({
      data: {
        title: data.title,
        script: `Script for ${data.title}`,
        description: `Description for ${data.title}`,
        status: data.status || 'DRAFT',
        postDate: data.postDate,
        videoLengthSeconds: data.videoLengthSeconds || 60,
        snapshots: data.snapshots ? {
          create: data.snapshots,
        } : undefined,
      },
      include: {
        snapshots: true,
      },
    });

    // Add hashtags if provided
    if (data.hashtags && data.hashtags.length > 0) {
      for (let i = 0; i < data.hashtags.length; i++) {
        const tag = data.hashtags[i];
        
        // Find or create hashtag
        let hashtag = await db.hashtag.findUnique({
          where: { tag: tag.toLowerCase() },
        });

        if (!hashtag) {
          hashtag = await db.hashtag.create({
            data: { tag: tag.toLowerCase() },
          });
        }

        // Link to video
        await db.videoHashtag.create({
          data: {
            videoId: video.id,
            hashtagId: hashtag.id,
            position: i,
          },
        });
      }
    }

    return video;
  } catch (error) {
    console.error('Error creating test video:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
};

/**
 * Get all videos from test database
 */
export const getAllVideos = async () => {
  const db = getTestDb();
  
  try {
    const videos = await db.video.findMany({
      include: {
        snapshots: true,
        hashtags: {
          include: { hashtag: true },
        },
      },
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
};
