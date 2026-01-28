import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // Otherwise, redirect to marketing landing page
  redirect('/(marketing)');
}

