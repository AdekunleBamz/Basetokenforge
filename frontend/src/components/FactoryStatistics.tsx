/**
 * Base Chain Statistics Display
 * 
 * Shows real-time statistics from the Token Factory on Base.
 */

"use client";

import { useFactoryStats } from "@/hooks/useFactoryStats";
import { formatEthValue } from "@/lib/formatting";

export function FactoryStatistics() {
  const { 
    totalTokensCreated, 
    creationFee, 
    totalFeesCollected,
    isLoading 
  } = useFactoryStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2 w-20" />
            <div className="h-8 bg-white/10 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Tokens Created"
        value={totalTokensCreated.toLocaleString()}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="orange"
      />
      
      <StatCard
        label="Creation Fee"
        value={`${creationFee} ETH`}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
        color="blue"
      />
      
      <StatCard
        label="Network"
        value="Base"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        }
        color="green"
        badge="Live"
      />
      
      <StatCard
        label="Gas Savings"
        value="~99%"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        color="purple"
        subtitle="vs Ethereum"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'orange' | 'blue' | 'green' | 'purple';
  badge?: string;
  subtitle?: string;
}

function StatCard({ label, value, icon, color, badge, subtitle }: StatCardProps) {
  const colorClasses = {
    orange: 'text-forge-orange bg-forge-orange/20',
    blue: 'text-base-blue bg-base-blue/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white/50 text-sm mb-1">{label}</p>
      <p className="text-white font-display font-bold text-2xl">{value}</p>
      {subtitle && (
        <p className="text-white/30 text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * Mini stats for inline display
 */
export function MiniStats() {
  const { totalTokensCreated, isLoading } = useFactoryStats();

  if (isLoading) {
    return <span className="text-white/50">Loading...</span>;
  }

  return (
    <span className="text-white/70">
      {totalTokensCreated.toLocaleString()} tokens deployed on Base
    </span>
  );
}
