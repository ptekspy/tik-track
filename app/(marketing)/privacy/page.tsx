'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function PrivacyPage() {
  return (
    <MarketingPageLayout title="Privacy Policy">
      <div className="space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, including your name,
            email address, and TikTok analytics data you choose to track.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services. We do not sell, trade, or rent your
            information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against
            accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You can make these requests by
            contacting us at hello@tik-track.app.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">5. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new
            policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">6. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{' '}
            <a href="mailto:hello@tik-track.app" className="text-pink-500 hover:text-pink-600">
              hello@tik-track.app
            </a>
            .
          </p>
        </section>
      </div>
    </MarketingPageLayout>
  );
}
