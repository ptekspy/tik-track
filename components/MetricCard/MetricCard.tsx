import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number; // Percentage change (positive or negative)
  icon?: LucideIcon;
  className?: string;
}

/**
 * MetricCard Component
 * 
 * Displays a metric with optional delta indicator and icon.
 * Server Component for static rendering.
 */
export function MetricCard({ label, value, delta, icon: Icon, className = '' }: MetricCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      // Format large numbers with commas
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatValue(value)}</p>
          
          {delta !== undefined && delta !== 0 && (
            <div className="flex items-center gap-1 mt-2">
              {delta > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{delta.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    {delta.toFixed(1)}%
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="flex-shrink-0 ml-4">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
