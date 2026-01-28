'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-[#0f0f23] dark:via-[#1e1b4b] dark:to-[#0f0f23]">
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
                <Link href="/features" className="hover:text-slate-900 dark:hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-slate-900 dark:hover:text-white transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700/50 pt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>&copy; 2026 tik-track. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
