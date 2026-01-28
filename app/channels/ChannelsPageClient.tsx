'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import type { Channel } from '@/lib/types/server';
import { ChannelForm } from '@/components/ChannelForm/ChannelForm';

export interface ChannelsPageClientProps {
  channels: Channel[];
  userId: string;
}

type EditingChannelId = string | null;

export function ChannelsPageClient({ channels, userId }: ChannelsPageClientProps) {
  const router = useRouter();
  const [editingChannelId, setEditingChannelId] = useState<EditingChannelId>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Channels</h1>
          <p className="text-gray-400">Manage your TikTok channels and accounts</p>
        </div>

        {/* Create Button */}
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#fe2c55]/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Channel
          </button>
        )}

        {/* Create Form */}
        {isCreating && (
          <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur">
            <h2 className="text-xl font-bold text-white mb-4">Create New Channel</h2>
            <ChannelForm
              onSuccess={() => {
                setIsCreating(false);
                router.refresh();
              }}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        {/* Channels List */}
        <div className="space-y-4">
          {channels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No channels yet. Create one to get started!</p>
            </div>
          ) : (
            channels.map((channel) => (
              <div
                key={channel.id}
                className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur hover:border-slate-600/50 transition-all group"
              >
                {editingChannelId === channel.id ? (
                  // Edit Form
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Edit Channel</h3>
                    <ChannelForm
                      channel={channel}
                      onSuccess={() => {
                        setEditingChannelId(null);
                        router.refresh();
                      }}
                      onCancel={() => setEditingChannelId(null)}
                    />
                  </div>
                ) : (
                  // Channel Display
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{channel.name}</h3>
                        {channel.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#fe2c55]/20 to-[#7c3aed]/20 text-[#25f4ee] text-xs font-semibold rounded-full border border-[#25f4ee]/20">
                            <Star className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-2">@{channel.handle}</p>
                      {channel.bio && <p className="text-gray-300 mb-4">{channel.bio}</p>}
                      <div className="flex items-center gap-4">
                        {!channel.isDefault && (
                          <button
                            onClick={() => {
                              // TODO: Implement setDefaultChannel
                              console.log('Set default:', channel.id);
                            }}
                            className="text-sm px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white transition-colors"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => setEditingChannelId(channel.id)}
                          className="text-sm px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        {channels.length > 1 && (
                          <button
                            onClick={() => {
                              // TODO: Implement delete
                              console.log('Delete:', channel.id);
                            }}
                            className="text-sm px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
