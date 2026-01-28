import { createAuthClient } from 'better-auth/react';
import { getAppUrl } from '@/lib/app-url';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin 
    : getAppUrl(),
});

// Export commonly used functions
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
