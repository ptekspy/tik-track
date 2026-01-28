'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus } from 'lucide-react';
import type { Channel } from '@/lib/types/server';

export interface ChannelSwitcherProps {
  channels: Channel[];
  currentChannelId: string;
  onChannelChange?: (channelId: string) => void;
}

export function ChannelSwitcher({ channels, currentChannelId, onChannelChange }: ChannelSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentChannel = channels.find(c => c.id === currentChannelId);

  if (channels.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Channel</span>
          <div className="flex flex-col items-start gap-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {currentChannel?.name || 'Select Channel'}
            </span>
            {currentChannel && (
              <span className="text-xs text-gray-500 dark:text-gray-400">@{currentChannel.handle}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => {
                  if (onChannelChange) {
                    onChannelChange(channel.id);
                  }
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-4 py-2 text-left transition-colors ${
                  channel.id === currentChannelId
                    ? 'bg-gradient-to-r from-[#fe2c55]/10 to-[#7c3aed]/10'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {channel.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    @{channel.handle}
                  </div>
                </div>
                {channel.id === currentChannelId && (
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] mt-1.5" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 p-2">
            <button
              onClick={() => {
                router.push('/channels');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              Manage Channels
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
