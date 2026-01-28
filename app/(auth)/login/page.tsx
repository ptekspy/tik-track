import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login | TikTrack',
  description: 'Sign in to your TikTrack account',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return <LoginForm searchParams={searchParams} />;
}
