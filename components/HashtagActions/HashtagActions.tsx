'use client';

import { useState } from 'react';
import type { Hashtag } from '@/lib/types/prisma';

export interface HashtagActionsProps {
  hashtags: Hashtag[];
  onMerge?: (sourceTag: string, targetTag: string) => Promise<void>;
}

export function HashtagActions({ hashtags, onMerge }: HashtagActionsProps) {
  const [sourceTag, setSourceTag] = useState('');
  const [targetTag, setTargetTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sourceTag || !targetTag) {
      setError('Both source and target tags are required');
      return;
    }

    if (sourceTag === targetTag) {
      setError('Source and target tags must be different');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (onMerge) {
        await onMerge(sourceTag, targetTag);
      }
      setSuccess(`Successfully merged #${sourceTag} into #${targetTag}`);
      setSourceTag('');
      setTargetTag('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to merge hashtags');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Merge Hashtags
      </h3>

      <form onSubmit={handleMerge} className="space-y-4">
        <div>
          <label htmlFor="source-tag" className="block text-sm font-medium text-gray-700 mb-1">
            Source Tag (will be removed)
          </label>
          <select
            id="source-tag"
            value={sourceTag}
            onChange={(e) => setSourceTag(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a tag...</option>
            {hashtags.map((hashtag) => (
              <option key={hashtag.id} value={hashtag.tag}>
                #{hashtag.tag}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="target-tag" className="block text-sm font-medium text-gray-700 mb-1">
            Target Tag (will receive all videos)
          </label>
          <input
            type="text"
            id="target-tag"
            value={targetTag}
            onChange={(e) => setTargetTag(e.target.value.toLowerCase())}
            disabled={isSubmitting}
            placeholder="Enter target tag name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a new tag name or an existing one
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !sourceTag || !targetTag}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Merging...' : 'Merge Hashtags'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">How merging works:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>All videos tagged with the source tag will be moved to the target tag</li>
          <li>The source tag will be deleted</li>
          <li>If the target tag doesn't exist, it will be created</li>
          <li>This action cannot be undone</li>
        </ul>
      </div>
    </div>
  );
}
