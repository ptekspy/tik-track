'use client';

import { MarketingPageLayout } from '@/components/MarketingPageLayout/MarketingPageLayout';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      features: ['1 Channel', 'Basic Analytics', '30 Day History', 'Community Support'],
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: ['3 Channels', 'Advanced Analytics', 'Unlimited History', 'Priority Support', 'Custom Reports', 'Hashtag Tracking'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited Channels', 'Custom Analytics', 'White Label', 'API Access', 'Dedicated Support', 'Advanced Integrations'],
    },
  ];

  return (
    <MarketingPageLayout title="Pricing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-lg border transition ${
              plan.highlighted
                ? 'bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-400 dark:border-pink-500'
                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50'
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>}
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
