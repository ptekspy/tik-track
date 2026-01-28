'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function AboutPage() {
  return (
    <MarketingPageLayout title="About TikTrack">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            We&apos;re building tools that help content creators understand and grow their TikTok presence. In a world
            where data is power, creators shouldn&apos;t have to rely on third-party tools to track their own success.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-4">Why TikTrack?</h2>
          <ul className="space-y-3 text-lg text-slate-600 dark:text-slate-300">
            <li className="flex gap-3">
              <span className="text-pink-500 font-bold">→</span>
              <span>Manual tracking gives you complete control over your data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-500 font-bold">→</span>
              <span>No API limitations or rate throttling</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-500 font-bold">→</span>
              <span>Organize and analyze all your videos in one place</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-500 font-bold">→</span>
              <span>Track trends and patterns over time</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-500 font-bold">→</span>
              <span>Manage multiple accounts seamlessly</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-4">Built by Creators</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            TikTrack was created by content creators who understand the challenges of growing on TikTok. We built the
            tools we wished existed.
          </p>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
