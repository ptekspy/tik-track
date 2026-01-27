import { VideoStatus } from '@/lib/types/prisma';

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
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
    PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
    ARCHIVED: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const labels = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} ${className}`}
      role="status"
      aria-label={`Status: ${labels[status]}`}
    >
      {labels[status]}
    </span>
  );
}
