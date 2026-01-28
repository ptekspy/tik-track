'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function SecurityPage() {
  return (
    <MarketingPageLayout title="Security">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-3xl font-bold mb-4">Your Data is Safe</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          We take security seriously. Here&apos;s how we protect your data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">🔐 Encryption</h3>
            <p>All data in transit is encrypted using industry-standard TLS 1.3.</p>
          </div>

          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">🔑 Authentication</h3>
            <p>Secure authentication with industry-standard OAuth 2.0 and session management.</p>
          </div>

          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">🛡️ Infrastructure</h3>
            <p>Hosted on secure, redundant infrastructure with regular security audits.</p>
          </div>

          <div className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2">📋 Compliance</h3>
            <p>Compliant with GDPR, CCPA, and other data protection regulations.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Privacy Practices</h2>
        <p>
          We don&apos;t sell your data. We don&apos;t share your data with third parties. We only use your data to provide
          tik-track services.
        </p>
      </div>
    </MarketingPageLayout>
  );
}
