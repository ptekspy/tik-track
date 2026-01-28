import type { SerializedSnapshot } from '@/lib/types/snapshot';
import { SnapshotType } from '@/lib/constants';
import { formatDate } from '@/lib/utils/dateUtils';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';

export interface SnapshotTableProps {
  snapshots: SerializedSnapshot[];
}

export function SnapshotTable({ snapshots }: SnapshotTableProps) {
  if (snapshots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No snapshots recorded yet.
      </div>
    );
  }

  // Sort snapshots by recordedAt descending (newest first)
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()
  );

  const snapshotTypeLabels: Record<SnapshotType, string> = {
    ONE_HOUR: '1 Hour',    TWO_HOUR: '2 Hours',    THREE_HOUR: '3 Hours',
    SIX_HOUR: '6 Hours',
    TWELVE_HOUR: '12 Hours',
    ONE_DAY: '1 Day',
    TWO_DAY: '2 Days',
    SEVEN_DAY: '7 Days',
    FOURTEEN_DAY: '14 Days',
    THIRTY_DAY: '30 Days',
  };

  // Calculate delta from previous snapshot
  const calculateDelta = (currentValue: number | null, previousValue: number | null): string | null => {
    if (currentValue === null || previousValue === null) return null;
    const delta = currentValue - previousValue;
    if (delta === 0) return '—';
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toLocaleString()}`;
  };

  const formatNumber = (value: number | null): string => {
    return value !== null ? value.toLocaleString() : '—';
  };

  const formatPercentage = (value: number | null): string => {
    return value !== null ? `${Math.round(value)}%` : '—';
  };

  const formatDecimalAsPercentage = (value: any): string => {
    if (value === null || value === undefined) return '—';
    // Handle Prisma.Decimal
    const numValue = typeof value === 'object' && 'toNumber' in value 
      ? value.toNumber() 
      : Number(value);
    return `${Math.round(numValue * 100)}%`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recorded
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Likes
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comments
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shares
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Followers
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completion
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engagement
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedSnapshots.map((snapshot, index) => {
            const previousSnapshot = sortedSnapshots[index + 1];
            const engagementRate = calculateEngagementRate(snapshot as any); // Accept both Decimal and number types

            return (
              <tr key={snapshot.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {snapshotTypeLabels[snapshot.snapshotType]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(snapshot.recordedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>{formatNumber(snapshot.views)}</div>
                  {previousSnapshot && (
                    <div className="text-xs text-gray-500">
                      {calculateDelta(snapshot.views, previousSnapshot.views)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>{formatNumber(snapshot.likes)}</div>
                  {previousSnapshot && (
                    <div className="text-xs text-gray-500">
                      {calculateDelta(snapshot.likes, previousSnapshot.likes)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>{formatNumber(snapshot.comments)}</div>
                  {previousSnapshot && (
                    <div className="text-xs text-gray-500">
                      {calculateDelta(snapshot.comments, previousSnapshot.comments)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>{formatNumber(snapshot.shares)}</div>
                  {previousSnapshot && (
                    <div className="text-xs text-gray-500">
                      {calculateDelta(snapshot.shares, previousSnapshot.shares)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div>{formatNumber(snapshot.newFollowers)}</div>
                  {previousSnapshot && (
                    <div className="text-xs text-gray-500">
                      {calculateDelta(snapshot.newFollowers, previousSnapshot.newFollowers)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatDecimalAsPercentage(snapshot.completionRate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatPercentage(engagementRate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
