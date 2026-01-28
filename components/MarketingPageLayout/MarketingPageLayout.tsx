'use client';

import Link from 'next/link';
import Image from 'next/image';

interface MarketingPageProps {
  title: string;
  children: React.ReactNode;
}

export function MarketingPageHeader({ title }: { title: string }) {
  return (
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
  );
}

export function MarketingPageLayout({ title, children }: MarketingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-[#0f0f23] dark:via-[#1e1b4b] dark:to-[#0f0f23] text-slate-900 dark:text-white">
      <MarketingPageHeader title={title} />

      <div className="pt-20">
        {/* Header */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">{title}</h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {children}
        </section>
      </div>
    </div>
  );
}
