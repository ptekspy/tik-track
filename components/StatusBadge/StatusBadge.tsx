import { VideoStatus } from '@/lib/constants';

export interface StatusBadgeProps {
  status: VideoStatus;
  className?: string;
}

/**
 * StatusBadge Component
 * 
 * Displays video status with color coding.
 * Gray = DRAFT, Green = PUBLISHED, Blue = ARCHIVED
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles = {
    DRAFT: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border-amber-200 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400 dark:border-amber-800',
    PUBLISHED: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-900 border-emerald-200 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400 dark:border-emerald-800',
    ARCHIVED: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-900 border-slate-200 dark:from-slate-900/30 dark:to-gray-900/30 dark:text-slate-400 dark:border-slate-800',
  };

  const labels = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
  };

  const icons = {
    DRAFT: '📝',
    PUBLISHED: '✨',
    ARCHIVED: '📦',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]} ${className} shadow-sm`}
      role="status"
      aria-label={`Status: ${labels[status]}`}
    >
      <span>{icons[status]}</span>
      {labels[status]}
    </span>
  );
}
