'use client';

import { AnalyticsSnapshot } from '@/lib/generated/client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatDate } from '@/lib/utils/dateUtils';
import { calculateEngagementRate } from '@/lib/metrics/calculateEngagementRate';

interface VideoChartsProps {
  snapshots: AnalyticsSnapshot[];
}

export function VideoCharts({ snapshots }: VideoChartsProps) {
  // Sort snapshots by recordedAt
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => a.recordedAt.getTime() - b.recordedAt.getTime()
  );

  // Prepare data for charts
  const chartData = sortedSnapshots.map((snapshot) => ({
    date: formatDate(snapshot.recordedAt),
    views: snapshot.views,
    likes: snapshot.likes,
    shares: snapshot.shares,
    comments: snapshot.comments,
    engagementRate: calculateEngagementRate(snapshot),
  }));

  return (
    <div className="space-y-8">
      {/* Views over time */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" fill="#10b981" />
            <Bar dataKey="shares" fill="#f59e0b" />
            <Bar dataKey="comments" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement rate */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Engagement Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => typeof value === 'number' ? `${value.toFixed(2)}%` : ''} />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagementRate"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Engagement Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
