'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function BlogPage() {
  const posts = [
    {
      title: 'How to Track Your TikTok Growth',
      date: 'January 28, 2026',
      excerpt: 'Learn the best practices for tracking your TikTok analytics and growing your audience systematically.',
    },
    {
      title: 'Understanding TikTok Metrics',
      date: 'January 21, 2026',
      excerpt: 'Deep dive into what each TikTok metric means and how to use them to improve your content.',
    },
    {
      title: 'Multi-Channel Strategy for Creators',
      date: 'January 14, 2026',
      excerpt: 'Tips for managing multiple TikTok accounts and organizing your content across channels.',
    },
  ];

  return (
    <MarketingPageLayout title="Blog">
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.title} className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer">
            <div className="flex justify-between items-start gap-4 mb-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{post.title}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{post.date}</p>
            <p className="text-slate-600 dark:text-slate-300">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
