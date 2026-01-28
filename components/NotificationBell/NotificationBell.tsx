'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, X, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import type { Notification } from '@/lib/notifications/getNotifications';
import { dismissNotification } from '@/actions/notifications/dismissNotification';

export interface NotificationBellProps {
  notifications: Notification[];
}

export function NotificationBell({ notifications }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissing, setDismissing] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleDismiss = async (notificationId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setDismissing(notificationId);
    const result = await dismissNotification(notificationId);
    
    if (!result.success) {
      console.error('Failed to dismiss notification');
      setDismissing(null);
    }
    // If successful, page will revalidate and notification will be gone
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'positive_signal':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'upcoming_snapshot':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'missed_snapshot':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'positive_signal':
        return 'border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10';
      case 'upcoming_snapshot':
        return 'border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10';
      case 'missed_snapshot':
        return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50/50 dark:bg-gray-800/10';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50 transition-colors"
        aria-label={`Notifications (${notifications.length})`}
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-[10px] font-bold text-white animate-pulse-glow">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] z-50">
          <div className="glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#fe2c55]" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white rounded-full">
                  {notifications.length}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notifications</p>
                  <p className="text-xs mt-1">You're all caught up! 🎉</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors ${getNotificationStyle(notification.type)}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <Link
                              href={notification.actionUrl}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                            >
                              {notification.actionLabel}
                            </Link>
                            <button
                              onClick={(e) => handleDismiss(notification.id, e)}
                              disabled={dismissing === notification.id}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 dark:hover:text-gray-300 dark:hover:bg-gray-800/50 transition-colors disabled:opacity-50"
                              aria-label="Dismiss notification"
                              title="Dismiss"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
