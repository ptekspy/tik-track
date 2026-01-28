'use client';

import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-[#0f0f23] dark:via-[#1e1b4b] dark:to-[#0f0f23] text-slate-900 dark:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-transparent backdrop-blur-sm border-b border-slate-200 dark:border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/logo-icon.png"
              alt="TikTrack Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src="/logo/logo-text.png"
              alt="TikTrack"
              width={100}
              height={32}
              className="h-6 w-auto"
            />
          </Link>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition font-medium text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {/* Header */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Powerful Features
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to track and grow your TikTok presence
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
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
          </div>
        </section>
      </div>
    </div>
  );
}
