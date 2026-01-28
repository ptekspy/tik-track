import { getUser } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import LandingPage from './(marketing)/page';

export default async function Home() {
  const user = await getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // Otherwise, render the marketing landing page
  return <LandingPage />;
}

