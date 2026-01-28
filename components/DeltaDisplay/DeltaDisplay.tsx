'use client';

import type { MetricDelta } from '@/lib/utils/deltas';
import { formatDelta, getDeltaClasses } from '@/lib/utils/deltas';

export interface DeltaDisplayProps {
  delta: MetricDelta | null;
  format?: 'absolute' | 'percentage' | 'both';
  className?: string;
  showArrow?: boolean;
}

/**
 * Display a metric delta with appropriate styling and formatting
 */
export function DeltaDisplay({ 
  delta, 
  format = 'both',
  className = '',
  showArrow = false,
}: DeltaDisplayProps) {
  if (!delta) {
    return <span className={`text-gray-400 dark:text-gray-500 ${className}`}>—</span>;
  }

  const colorClasses = getDeltaClasses(delta);
  const formattedValue = formatDelta(delta, format);
  
  // Extract arrow from formatted value if showing arrows
  let displayValue = formattedValue;
  let arrow = '';
  
  if (showArrow && format === 'percentage') {
    const match = formattedValue.match(/^([↑↓→])\s*(.*)/);
    if (match) {
      arrow = match[1];
      displayValue = match[2];
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${colorClasses} ${className}`}>
      {showArrow && arrow && (
        <span className="text-xs" aria-hidden="true">{arrow}</span>
      )}
      <span>{displayValue}</span>
    </span>
  );
}

/**
 * Compact delta display for tight spaces (just percentage with arrow)
 */
export function CompactDelta({ delta, className = '' }: { delta: MetricDelta | null; className?: string }) {
  return (
    <DeltaDisplay 
      delta={delta} 
      format="percentage" 
      showArrow 
      className={`text-xs ${className}`}
    />
  );
}

/**
 * Full delta display with both absolute and percentage
 */
export function FullDelta({ delta, className = '' }: { delta: MetricDelta | null; className?: string }) {
  return (
    <DeltaDisplay 
      delta={delta} 
      format="both" 
      className={`text-sm ${className}`}
    />
  );
}
