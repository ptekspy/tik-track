'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { LayoutDashboard, Video, FileEdit, Hash, Menu, X } from 'lucide-react';
import { NotificationBell } from '../NotificationBell/NotificationBell';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { ChannelSwitcher } from '../ChannelSwitcher/ChannelSwitcher';
import type { Notification } from '@/lib/notifications/getNotifications';
import type { Channel } from '@/lib/types/server';

export interface NavigationClientProps {
  draftCount: number;
  notifications: Notification[];
  channels: Channel[];
  currentChannelId: string;
}

export function NavigationClient({ draftCount, notifications, channels, currentChannelId }: NavigationClientProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/videos/new', label: 'New Video', icon: Video },
    { href: '/drafts', label: 'Drafts', icon: FileEdit, badge: draftCount > 0 ? draftCount : null },
    { href: '/hashtags', label: 'Hashtags', icon: Hash },
  ];

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <Image
                src="/logo/logo-icon.png"
                alt="TikTrack Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <Image
                src="/logo/logo-text.png"
                alt="TikTrack"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all group ${
                      active
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-lg"></div>
                    )}
                    <div className={`relative flex items-center space-x-2 ${!active && 'group-hover:scale-105'}`}>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="ml-1 bg-[#25f4ee] text-[#0f0f23] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-glow">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ChannelSwitcher channels={channels} currentChannelId={currentChannelId} />
            <NotificationBell notifications={notifications} />
            <LogoutButton variant="icon" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationBell notifications={notifications} />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 border-b border-white/10">
            <ChannelSwitcher channels={channels} currentChannelId={currentChannelId} />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white'
                      : 'text-gray-600 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-auto bg-[#25f4ee] text-[#0f0f23] text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            {/* Mobile Logout Button */}
            <div className="border-t border-white/10 mt-2 pt-2">
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <LogoutButton variant="full" showText />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
