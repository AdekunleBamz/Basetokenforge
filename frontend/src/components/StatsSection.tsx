"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface Stat {
  value: string;
  label: string;
  highlight?: boolean;
}

const stats: Stat[] = [
  { value: '~$0.01', label: 'Gas Cost' },
  { value: '<10s', label: 'Deploy Time', highlight: true },
  { value: '100%', label: 'On-chain' },
];

interface StatsGridProps {
  className?: string;
}

export function StatsGrid({ className }: StatsGridProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-8 max-w-xl mx-auto', className)}>
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  return (
    <div className="text-center">
      <div
        className={cn(
          'font-display font-bold text-3xl md:text-4xl',
          stat.highlight ? 'text-forge-orange' : 'text-white'
        )}
      >
        {stat.value}
      </div>
      <div className="text-white/50 text-sm mt-1">{stat.label}</div>
    </div>
  );
}

// Extended stats section
interface ExtendedStat {
  value: string;
  label: string;
  description: string;
}

const extendedStats: ExtendedStat[] = [
  {
    value: '1000+',
    label: 'Tokens Created',
    description: 'Tokens deployed through Token Forge',
  },
  {
    value: '$50K+',
    label: 'Gas Saved',
    description: 'Compared to Ethereum mainnet',
  },
  {
    value: '2.5s',
    label: 'Avg. Block Time',
    description: 'Fast confirmations on Base',
  },
];

export function ExtendedStatsSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-16', className)}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {extendedStats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="font-display font-bold text-4xl text-forge-orange mb-2">
                {stat.value}
              </div>
              <div className="font-medium text-white mb-1">{stat.label}</div>
              <div className="text-white/50 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
