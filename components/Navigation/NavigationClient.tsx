'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavigationClientProps {
  draftCount: number;
}

export function NavigationClient({ draftCount }: NavigationClientProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/videos/new', label: 'New Video' },
    { href: '/drafts', label: 'Drafts', badge: draftCount > 0 ? draftCount : null },
    { href: '/hashtags', label: 'Hashtags' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                TikTrack
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.href)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
