'use client';

import type { SerializedSnapshot } from '@/lib/types/snapshot';
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
  snapshots: SerializedSnapshot[];
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
    engagementRate: calculateEngagementRate(snapshot as any), // Accept both Decimal and number types
  }));

  return (
    <div className="space-y-6">
      {/* Views over time */}
      <div className="glass rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent mb-6">
          👁️ Views Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement metrics */}
      <div className="glass rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-6">
          📊 Engagement Metrics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Bar dataKey="likes" fill="url(#likesGradient)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="shares" fill="url(#sharesGradient)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="comments" fill="url(#commentsGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="sharesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement rate */}
      <div className="glass rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#ec4899] bg-clip-text text-transparent mb-6">
          💫 Engagement Rate
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              formatter={(value) => typeof value === 'number' ? `${value.toFixed(2)}%` : ''} 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagementRate"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ r: 5, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
              name="Engagement Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
