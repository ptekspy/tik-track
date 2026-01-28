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
    positive: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/30',
    negative: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30',
    neutral: 'bg-gradient-to-r from-slate-400 to-gray-400 text-white shadow-lg shadow-gray-500/30',
  };

  const labels = {
    positive: '🚀 Positive',
    negative: '⚠️ Negative',
    neutral: '➖ Neutral',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${styles[signal]} ${className}`}
      role="status"
      aria-label={labels[signal]}
    >
      {labels[signal]}
    </span>
  );
}
