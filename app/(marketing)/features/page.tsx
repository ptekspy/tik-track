'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

const features = [
  {
    title: 'Real-time Analytics',
    description: 'Track your TikTok video performance with instant, detailed analytics and insights.',
    icon: '📊',
  },
  {
    title: 'Video Management',
    description: 'Organize and manage all your TikTok videos in one central dashboard.',
    icon: '🎬',
  },
  {
    title: 'Hashtag Tracking',
    description: 'Monitor hashtag performance and discover trending topics for your content.',
    icon: '#️⃣',
  },
  {
    title: 'Snapshot History',
    description: 'View historical snapshots of your video metrics to track growth over time.',
    icon: '📸',
  },
  {
    title: 'Multi-Channel Support',
    description: 'Manage multiple TikTok accounts from a single dashboard.',
    icon: '🔀',
  },
  {
    title: 'Export & Reports',
    description: 'Download your analytics data and generate detailed performance reports.',
    icon: '📥',
  },
];

export default function FeaturesPage() {
  return (
    <MarketingPageLayout title="Powerful Features">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition group"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-400 transition">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
