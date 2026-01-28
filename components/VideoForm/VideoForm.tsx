'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VideoStatus } from '@/lib/constants';
import { TimeInput } from '@/components/TimeInput/TimeInput';
import { PercentageInput } from '@/components/PercentageInput/PercentageInput';
import { HashtagInput } from '@/components/HashtagInput/HashtagInput';
import { FormError } from '@/components/FormError/FormError';
import type { Channel } from '@/lib/types/server';

export interface VideoFormData {
  title: string;
  script: string;
  description: string;
  videoLengthSeconds: number;
  status: VideoStatus;
  postDate?: string; // ISO date string
  hashtags: string[];
  channelId?: string;
  // Optional first snapshot data (only if status=PUBLISHED)
  firstSnapshot?: {
    views?: number;
    totalPlayTimeSeconds?: number;
    avgWatchTimeSeconds?: number;
    completionRate?: number;
    newFollowers?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    favorites?: number;
    profileViews?: number;
    reach?: number;
  };
}

export interface VideoFormProps {
  defaultValues?: Partial<VideoFormData>;
  onSubmit: (data: VideoFormData) => Promise<void>;
  onCancel?: () => void;
  channels?: Channel[];
}

/**
 * VideoForm Component
 * 
 * Form for creating/editing video metadata with optional first analytics snapshot.
 * Uses react-hook-form for validation and state management.
 */
export function VideoForm({ defaultValues, onSubmit, onCancel, channels = [] }: VideoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: '',
      script: '',
      description: '',
      videoLengthSeconds: 0,
      status: VideoStatus.DRAFT,
      hashtags: [],
      ...defaultValues,
    },
  });

  const status = watch('status');
  const hashtags = watch('hashtags') || [];
  const videoLengthSeconds = watch('videoLengthSeconds') || 0;

  const isPublished = status === VideoStatus.PUBLISHED;

  const handleFormSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Video Details Section */}
      <div className="glass rounded-2xl p-6 border border-white/20 space-y-5">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent">Video Details</h2>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
          {errors.title && <FormError error={errors.title.message} />}
        </div>

        {/* Channel */}
        {channels.length > 1 && (
          <div>
            <label htmlFor="channelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Channel
            </label>
            <select
              id="channelId"
              {...register('channelId')}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all"
              disabled={isSubmitting}
            >
              <option value="">Select a channel (uses default)</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name} {channel.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
            {errors.channelId && <FormError error={errors.channelId.message} />}
          </div>
        )}

        {/* Script */}
        <div>
          <label htmlFor="script" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Script *
          </label>
          <textarea
            id="script"
            {...register('script', { required: 'Script is required' })}
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all min-h-[100px] resize-y"
            disabled={isSubmitting}
          />
          {errors.script && <FormError error={errors.script.message} />}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all min-h-[100px] resize-y"
            disabled={isSubmitting}
          />
          {errors.description && <FormError error={errors.description.message} />}
        </div>

        {/* Video Length */}
        <div>
          <label htmlFor="videoLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Length *
          </label>
          <TimeInput
            value={videoLengthSeconds}
            onChange={(seconds) => setValue('videoLengthSeconds', seconds)}
            disabled={isSubmitting}
          />
          {errors.videoLengthSeconds && <FormError error={errors.videoLengthSeconds.message} />}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all"
            disabled={isSubmitting}
          >
            <option value={VideoStatus.DRAFT}>📝 Draft</option>
            <option value={VideoStatus.PUBLISHED}>✨ Published</option>
            <option value={VideoStatus.ARCHIVED}>📦 Archived</option>
          </select>
          {errors.status && <FormError error={errors.status.message} />}
        </div>

        {/* Post Date (required if status=PUBLISHED) */}
        {isPublished && (
          <div>
            <label htmlFor="postDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Post Date *
            </label>
            <input
              id="postDate"
              type="datetime-local"
              {...register('postDate', {
                required: isPublished ? 'Post date is required for published videos' : false,
              })}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
            {errors.postDate && <FormError error={errors.postDate.message} />}
          </div>
        )}

        {/* Hashtags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hashtags</label>
          <HashtagInput
            value={hashtags}
            onChange={(tags) => setValue('hashtags', tags)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Optional First Snapshot Section (only for PUBLISHED) */}
      {isPublished && (
        <div className="glass rounded-2xl p-6 border border-white/20 space-y-5">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Initial Analytics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              You can optionally capture the first analytics snapshot now.
            </p>
          </div>

          {/* Views */}
          <div>
            <label htmlFor="views" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              👁️ Views
            </label>
            <input
              id="views"
              type="number"
              min="0"
              {...register('firstSnapshot.views', { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Total Play Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Total Play Time</label>
            <TimeInput
              value={watch('firstSnapshot.totalPlayTimeSeconds') || 0}
              onChange={(seconds) => setValue('firstSnapshot.totalPlayTimeSeconds', seconds)}
              disabled={isSubmitting}
            />
          </div>

          {/* Avg Watch Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Avg Watch Time</label>
            <TimeInput
              value={watch('firstSnapshot.avgWatchTimeSeconds') || 0}
              onChange={(seconds) => setValue('firstSnapshot.avgWatchTimeSeconds', seconds)}
              disabled={isSubmitting}
            />
          </div>

          {/* Completion Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">Completion Rate</label>
            <PercentageInput
              value={watch('firstSnapshot.completionRate') || 0}
              onChange={(decimal) => setValue('firstSnapshot.completionRate', decimal)}
              disabled={isSubmitting}
            />
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="likes" className="block text-sm font-medium mb-1">
                Likes
              </label>
              <input
                id="likes"
                type="number"
                min="0"
                {...register('firstSnapshot.likes', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium mb-1">
                Comments
              </label>
              <input
                id="comments"
                type="number"
                min="0"
                {...register('firstSnapshot.comments', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="shares" className="block text-sm font-medium mb-1">
                Shares
              </label>
              <input
                id="shares"
                type="number"
                min="0"
                {...register('firstSnapshot.shares', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="favorites" className="block text-sm font-medium mb-1">
                Favorites
              </label>
              <input
                id="favorites"
                type="number"
                min="0"
                {...register('firstSnapshot.favorites', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="newFollowers" className="block text-sm font-medium mb-1">
                New Followers
              </label>
              <input
                id="newFollowers"
                type="number"
                min="0"
                {...register('firstSnapshot.newFollowers', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="profileViews" className="block text-sm font-medium mb-1">
                Profile Views
              </label>
              <input
                id="profileViews"
                type="number"
                min="0"
                {...register('firstSnapshot.profileViews', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Reach */}
          <div>
            <label htmlFor="reach" className="block text-sm font-medium mb-1">
              Reach
            </label>
            <input
              id="reach"
              type="number"
              min="0"
              {...register('firstSnapshot.reach', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Submit Error */}
      {submitError && <FormError error={submitError} />}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 disabled:opacity-50 transition-all font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 text-white bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none transition-all btn-glow"
        >
          {isSubmitting ? 'Saving...' : 'Save Video'}
        </button>
      </div>
    </form>
  );
}
