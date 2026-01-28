import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Get the current session (if any)
 * Returns null if not authenticated
 * Use in Server Components and Server Actions
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Get the current user (if any)
 * Returns null if not authenticated
 * Use in Server Components and Server Actions
 */
export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use in Server Components and Server Actions
 */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Require specific role - redirect to login if not authenticated or unauthorized
 * Use in Server Components and Server Actions
 */
export async function requireRole(role: 'OWNER' | 'ADMIN' | 'USER') {
  const user = await requireUser();
  
  if (user.role !== role) {
    // If user is OWNER, they can access anything
    if (user.role === 'OWNER') {
      return user;
    }
    
    // If requiring ADMIN, allow OWNER but not USER
    if (role === 'ADMIN' && user.role === 'ADMIN') {
      return user;
    }
    
    redirect('/unauthorized');
  }
  
  return user;
}
