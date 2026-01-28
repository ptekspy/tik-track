'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth/client';

export interface LogoutButtonProps {
  variant?: 'icon' | 'full';
  showText?: boolean;
}

export function LogoutButton({ variant = 'icon', showText = false }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login');
          },
        },
      });
    });
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
    >
      <LogOut className="w-4 h-4" />
      {showText && <span>Logout</span>}
    </button>
  );
}
