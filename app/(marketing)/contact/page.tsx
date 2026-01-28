'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function ContactPage() {
  return (
    <MarketingPageLayout title="Contact Us">
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          Have questions or feedback? We&apos;d love to hear from you!
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">📧 Email</h3>
            <a href="mailto:hello@tik-track.app" className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400">
              hello@tik-track.app
            </a>
          </div>

          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">💬 Social Media</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">Follow us on social media for updates and announcements:</p>
            <div className="flex gap-4">
              <a href="#" className="text-pink-500 hover:text-pink-600">Twitter</a>
              <a href="#" className="text-pink-500 hover:text-pink-600">Instagram</a>
              <a href="#" className="text-pink-500 hover:text-pink-600">TikTok</a>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">🐛 Report a Bug</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">Found an issue? Let us know by opening an issue on GitHub:</p>
            <a href="#" className="text-pink-500 hover:text-pink-600">GitHub Issues</a>
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
