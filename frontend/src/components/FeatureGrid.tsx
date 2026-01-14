"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { IconCode, IconGas, IconLightning, IconWallet } from '@/components/icons/social';

interface Feature {
  title: string;
  description: string;
  icon: 'code' | 'gas' | 'lightning' | 'wallet';
}

const features: Feature[] = [
  {
    title: 'No Code Required',
    description: 'Deploy tokens with just a few clicks. No programming knowledge needed.',
    icon: 'code',
  },
  {
    title: 'Ultra-Low Gas',
    description: 'Base L2 means minimal transaction costs - usually less than $0.01.',
    icon: 'gas',
  },
  {
    title: 'Instant Deploy',
    description: 'Your token is live on the blockchain in under 10 seconds.',
    icon: 'lightning',
  },
  {
    title: 'Full Ownership',
    description: '100% of the supply goes directly to your connected wallet.',
    icon: 'wallet',
  },
];

const iconComponents = {
  code: IconCode,
  gas: IconGas,
  lightning: IconLightning,
  wallet: IconWallet,
};

interface FeatureGridProps {
  className?: string;
}

export function FeatureGrid({ className }: FeatureGridProps) {
  return (
    <section className={cn('py-16', className)}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Why Token Forge?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            The easiest way to create ERC20 tokens on Base
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = iconComponents[feature.icon];

  return (
    <div className="glass rounded-2xl p-6 transition-all duration-300 hover:border-forge-orange/30 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-forge-orange/10 flex items-center justify-center mb-4">
        <Icon className="text-forge-orange" size={24} />
      </div>
      <h3 className="font-display font-semibold text-xl text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-white/60">
        {feature.description}
      </p>
    </div>
  );
}
