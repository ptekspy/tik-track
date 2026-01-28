import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '@/lib/database/client';
import { getAppUrl } from '@/lib/app-url';

const appUrl = getAppUrl();

export const auth = betterAuth({
  baseURL: appUrl,
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  secret: process.env.AUTH_SECRET || process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // We'll enable this after email service is set up
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
      },
    },
  },
  trustedOrigins: [appUrl, "https://www.tri-track.com", "https://tik-track.com"],
  socialProviders: {
        tiktok: { 
            clientSecret: process.env.TIKTOK_CLIENT_SECRET as string, 
            clientKey: process.env.TIKTOK_CLIENT_KEY as string, 
        }, 
    },
});

export type Session = typeof auth.$Infer.Session;
