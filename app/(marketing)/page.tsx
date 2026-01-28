'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
];

const stats = [
  { label: 'Active Users', value: '5K+' },
  { label: 'Videos Tracked', value: '50K+' },
  { label: 'Snapshots Created', value: '1M+' },
];

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-[#0f0f23] dark:via-[#1e1b4b] dark:to-[#0f0f23] text-slate-900 dark:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-transparent backdrop-blur-sm border-b border-slate-200 dark:border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Track Your TikTok
            <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Success
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Real-time analytics and insights for your TikTok videos. Monitor performance, track trends, and grow your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition font-semibold text-lg"
            >
              Get Started Free
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition font-semibold text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text mb-2">
                {stat.value}
              </div>
              <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-slate-900 dark:text-white">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-400 transition">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500/5 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/10 border-y border-slate-200 dark:border-slate-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Ready to Grow Your TikTok?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of creators tracking their success with tik-track.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition font-semibold text-lg"
          >
            Start Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
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
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Track your TikTok success with real-time analytics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700/50 pt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>&copy; 2026 tik-track. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
