'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SnapshotType } from '@/lib/constants';
import { TimeInput } from '@/components/TimeInput/TimeInput';
import { PercentageInput } from '@/components/PercentageInput/PercentageInput';
import { FormError } from '@/components/FormError/FormError';

export interface SnapshotFormData {
  snapshotType: SnapshotType;
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
}

export interface SnapshotFormProps {
  videoId: string;
  availableTypes: SnapshotType[];
  defaultValues?: Partial<SnapshotFormData>;
  previousSnapshot?: SnapshotFormData | null;
  onSubmit: (data: SnapshotFormData) => Promise<void>;
  onCancel?: () => void;
}

const SNAPSHOT_TYPE_LABELS: Record<SnapshotType, string> = {
  [SnapshotType.ONE_HOUR]: '1 Hour',  [SnapshotType.TWO_HOUR]: '2 Hours',  [SnapshotType.THREE_HOUR]: '3 Hours',
  [SnapshotType.SIX_HOUR]: '6 Hours',
  [SnapshotType.TWELVE_HOUR]: '12 Hours',
  [SnapshotType.ONE_DAY]: '1 Day',
  [SnapshotType.TWO_DAY]: '2 Days',
  [SnapshotType.SEVEN_DAY]: '7 Days',
  [SnapshotType.FOURTEEN_DAY]: '14 Days',
  [SnapshotType.THIRTY_DAY]: '30 Days',
};

/**
 * SnapshotForm Component
 * 
 * Form for creating/editing analytics snapshots.
 * Shows delta from previous snapshot when available.
 */
export function SnapshotForm({
  videoId,
  availableTypes,
  defaultValues,
  previousSnapshot,
  onSubmit,
  onCancel,
}: SnapshotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SnapshotFormData>({
    defaultValues: {
      snapshotType: availableTypes[0] || SnapshotType.ONE_HOUR,
      ...defaultValues,
    },
  });

  const totalPlayTimeSeconds = watch('totalPlayTimeSeconds') || 0;
  const avgWatchTimeSeconds = watch('avgWatchTimeSeconds') || 0;
  const completionRate = watch('completionRate') || 0;
  const views = watch('views') || 0;
  const likes = watch('likes') || 0;
  const comments = watch('comments') || 0;
  const shares = watch('shares') || 0;
  const favorites = watch('favorites') || 0;

  const handleFormSubmit = async (data: SnapshotFormData) => {
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

  const getDelta = (current: number | undefined, field: keyof SnapshotFormData): number | null => {
    if (current === undefined || !previousSnapshot) return null;
    const prev = previousSnapshot[field];
    if (typeof prev !== 'number') return null;
    return current - prev;
  };

  const renderDelta = (delta: number | null) => {
    if (delta === null) return null;
    const sign = delta > 0 ? '+' : '';
    const color = delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-600';
    return <span className={`ml-2 text-sm ${color}`}>({sign}{delta.toLocaleString()})</span>;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Snapshot Type */}
      <div>
        <label htmlFor="snapshotType" className="block text-sm font-medium mb-1">
          Snapshot Type *
        </label>
        <select
          id="snapshotType"
          {...register('snapshotType', { required: 'Snapshot type is required' })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {SNAPSHOT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        {errors.snapshotType && <FormError error={errors.snapshotType.message} />}
      </div>

      {/* Views */}
      <div>
        <label htmlFor="views" className="block text-sm font-medium mb-1">
          Views {renderDelta(getDelta(views, 'views'))}
        </label>
        <input
          id="views"
          type="number"
          min="0"
          {...register('views', { valueAsNumber: true })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </div>

      {/* Time Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Time Metrics</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Total Play Time {renderDelta(getDelta(totalPlayTimeSeconds, 'totalPlayTimeSeconds'))}
          </label>
          <TimeInput
            value={totalPlayTimeSeconds}
            onChange={(seconds) => setValue('totalPlayTimeSeconds', seconds)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Avg Watch Time {renderDelta(getDelta(avgWatchTimeSeconds, 'avgWatchTimeSeconds'))}
          </label>
          <TimeInput
            value={avgWatchTimeSeconds}
            onChange={(seconds) => setValue('avgWatchTimeSeconds', seconds)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Completion Rate</label>
          <PercentageInput
            value={completionRate}
            onChange={(decimal) => setValue('completionRate', decimal)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Engagement</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="likes" className="block text-sm font-medium mb-1">
              Likes {renderDelta(getDelta(likes, 'likes'))}
            </label>
            <input
              id="likes"
              type="number"
              min="0"
              {...register('likes', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium mb-1">
              Comments {renderDelta(getDelta(comments, 'comments'))}
            </label>
            <input
              id="comments"
              type="number"
              min="0"
              {...register('comments', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="shares" className="block text-sm font-medium mb-1">
              Shares {renderDelta(getDelta(shares, 'shares'))}
            </label>
            <input
              id="shares"
              type="number"
              min="0"
              {...register('shares', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="favorites" className="block text-sm font-medium mb-1">
              Favorites {renderDelta(getDelta(favorites, 'favorites'))}
            </label>
            <input
              id="favorites"
              type="number"
              min="0"
              {...register('favorites', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Growth</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="newFollowers" className="block text-sm font-medium mb-1">
              New Followers
            </label>
            <input
              id="newFollowers"
              type="number"
              min="0"
              {...register('newFollowers', { valueAsNumber: true })}
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
              {...register('profileViews', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reach" className="block text-sm font-medium mb-1">
            Reach
          </label>
          <input
            id="reach"
            type="number"
            min="0"
            {...register('reach', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Submit Error */}
      {submitError && <FormError error={submitError} />}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Snapshot'}
        </button>
      </div>
    </form>
  );
}
