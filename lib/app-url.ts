/**
 * Get the application URL dynamically
 * Works in both local development and production (Vercel)
 */
export function getAppUrl(): string {
  // Vercel provides this automatically in production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
