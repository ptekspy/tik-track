/**
 * Bootstrap Owner Account
 * 
 * Creates the initial OWNER user account with credentials.
 * This script is idempotent - safe to run multiple times.
 * 
 * Usage:
 *   pnpm bootstrap:owner
 * 
 * Environment Variables Required:
 *   - BOOTSTRAP_PASSWORD: Initial password for the owner account
 *   - PRISMA_DATABASE_URL: Database connection string
 */

import 'dotenv/config';
import { db } from '../lib/database/client';
import { UserRole } from '../lib/types/server';

const OWNER_EMAIL = 'pkenneally93@gmail.com';

async function bootstrapOwner() {
  console.log('🚀 Bootstrapping owner account...\n');

  // Validate environment
  const bootstrapPassword = process.env.BOOTSTRAP_PASSWORD;
  if (!bootstrapPassword) {
    console.error('❌ Error: BOOTSTRAP_PASSWORD environment variable is required');
    console.error('   Usage: BOOTSTRAP_PASSWORD="your-password" tsx scripts/bootstrap-owner.ts');
    process.exit(1);
  }

  if (bootstrapPassword.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters');
    process.exit(1);
  }

  try {
    // Check if owner already exists
    const existingUser = await db.user.findUnique({
      where: { email: OWNER_EMAIL },
    });

    if (existingUser) {
      console.log(`✅ Owner account already exists:`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   Created: ${existingUser.createdAt.toISOString()}`);
      console.log('\n⚠️  If you need to reset the password, delete the user and run this script again.');
      return;
    }

    // Use Better Auth's signup to create user with proper password hashing
    const { auth } = await import('../lib/auth');
    
    const result = await auth.api.signUpEmail({
      body: {
        email: OWNER_EMAIL,
        password: bootstrapPassword,
        name: 'Paddy Kenneally',
      },
    });

    if (!result) {
      throw new Error('Failed to create user account');
    }

    // Update user role to OWNER
    const user = await db.user.update({
      where: { email: OWNER_EMAIL },
      data: { 
        role: UserRole.OWNER,
        emailVerified: true, // Owner account is pre-verified
      },
    });

    console.log('✅ Owner account created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user.id}`);
    console.log('\n🎉 Bootstrap complete! You can now log in.');
    
  } catch (error) {
    console.error('❌ Error creating owner account:', error);
    throw error;
  }
}

// Run the bootstrap
bootstrapOwner()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Bootstrap failed:', error);
    process.exit(1);
  });
