'use client';

import Link from 'next/link';
import { Bell, TrendingUp, Clock, AlertCircle, Sparkles } from 'lucide-react';
import type { Notification } from '@/lib/notifications/getNotifications';

export interface ActionPanelProps {
  notifications: Notification[];
  maxItems?: number;
}

export function ActionPanel({ notifications, maxItems = 5 }: ActionPanelProps) {
  const topNotifications = notifications.slice(0, maxItems);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'positive_signal':
        return <TrendingUp className="w-5 h-5" />;
      case 'upcoming_snapshot':
        return <Clock className="w-5 h-5" />;
      case 'missed_snapshot':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'positive_signal':
        return {
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-green-50/50 dark:bg-green-900/10',
          border: 'border-green-200 dark:border-green-800',
        };
      case 'upcoming_snapshot':
        return {
          gradient: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-50/50 dark:bg-amber-900/10',
          border: 'border-amber-200 dark:border-amber-800',
        };
      case 'missed_snapshot':
        return {
          gradient: 'from-red-500 to-rose-500',
          bg: 'bg-red-50/50 dark:bg-red-900/10',
          border: 'border-red-200 dark:border-red-800',
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50/50 dark:bg-gray-800/10',
          border: 'border-gray-200 dark:border-gray-700',
        };
    }
  };

  if (topNotifications.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-[#fe2c55]" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            What to do next
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You're all caught up! 🎉
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            No pending actions right now. Keep up the great work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-[#fe2c55]" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          What to do next
        </h2>
        <span className="ml-auto px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white rounded-full">
          {notifications.length} {notifications.length === 1 ? 'action' : 'actions'}
        </span>
      </div>

      <div className="space-y-3">
        {topNotifications.map((notification) => {
          const style = getNotificationStyle(notification.type);
          return (
            <div
              key={notification.id}
              className={`group relative rounded-xl p-4 border ${style.bg} ${style.border} hover:shadow-md transition-all`}
            >
              <div className="flex gap-4 items-start">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${style.gradient} text-white`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    {notification.message}
                  </p>
                  <Link
                    href={notification.actionUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    {notification.actionLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            +{notifications.length - maxItems} more {notifications.length - maxItems === 1 ? 'action' : 'actions'} available in notifications
          </p>
        </div>
      )}
    </div>
  );
}
