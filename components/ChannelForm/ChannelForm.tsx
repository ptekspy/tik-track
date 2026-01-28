'use client';

import { useState } from 'react';
import { createChannelAction } from '@/actions/channels/createChannelAction';
import { updateChannelAction } from '@/actions/channels/updateChannelAction';
import { deleteChannelAction } from '@/actions/channels/deleteChannelAction';
import { setDefaultChannelAction } from '@/actions/channels/setDefaultChannelAction';
import type { Channel } from '@/lib/types/server';
import { Loader } from 'lucide-react';

export interface ChannelFormProps {
  channel?: Channel;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChannelForm({ channel, onSuccess, onCancel }: ChannelFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: channel?.name || '',
    handle: channel?.handle || '',
    bio: channel?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (channel) {
        await updateChannelAction(channel.id, formData);
      } else {
        await createChannelAction(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save channel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Channel Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Main Channel"
          required
          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe2c55] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="handle" className="block text-sm font-medium text-gray-300 mb-2">
          Handle (username)
        </label>
        <input
          id="handle"
          name="handle"
          type="text"
          value={formData.handle}
          onChange={handleChange}
          placeholder="mychannel"
          required
          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe2c55] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Describe your channel..."
          rows={3}
          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe2c55] transition-colors resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#fe2c55]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading && <Loader className="w-4 h-4 animate-spin" />}
          {channel ? 'Update Channel' : 'Create Channel'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
