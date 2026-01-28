'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function TermsPage() {
  return (
    <MarketingPageLayout title="Terms of Service">
      <div className="space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using TikTrack, you accept and agree to be bound by the terms and provision of this
            agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on
            TikTrack for personal, non-commercial transitory viewing only. This is the grant of a license, not a
            transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on TikTrack</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">3. Disclaimer</h2>
          <p>
            The materials on TikTrack are provided on an &apos;as is&apos; basis. TikTrack makes no warranties, expressed
            or implied, and hereby disclaims and negates all other warranties including, without limitation, implied
            warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">4. Limitations</h2>
          <p>
            In no event shall TikTrack or its suppliers be liable for any damages (including, without limitation, damages
            for loss of data or profit, or due to business interruption) arising out of the use or inability to use the
            materials on TikTrack.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on TikTrack could include technical, typographical, or photographic errors. TikTrack
            does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">6. Modifications</h2>
          <p>
            TikTrack may revise these terms of service for its website at any time without notice. By using this website,
            you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in
            which TikTrack is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that
            location.
          </p>
        </section>
      </div>
    </MarketingPageLayout>
  );
}
