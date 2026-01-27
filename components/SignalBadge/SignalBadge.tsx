import type { SignalResult } from '@/lib/types/metrics';

export interface SignalBadgeProps {
  signal: SignalResult;
  className?: string;
}

/**
 * SignalBadge Component
 * 
 * Displays video performance signal with color coding.
 * Green = positive, Red = negative, Gray = neutral
 */
export function SignalBadge({ signal, className = '' }: SignalBadgeProps) {
  const styles = {
    positive: 'bg-green-100 text-green-800 border-green-200',
    negative: 'bg-red-100 text-red-800 border-red-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels = {
    positive: 'Positive Signal',
    negative: 'Negative Signal',
    neutral: 'Neutral',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[signal]} ${className}`}
      role="status"
      aria-label={labels[signal]}
    >
      {labels[signal]}
    </span>
  );
}
