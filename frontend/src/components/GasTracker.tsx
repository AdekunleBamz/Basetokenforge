/**
 * Gas Tracker Component
 * 
 * Displays real-time gas prices on Base L2.
 */

"use client";

import { useBaseGasPrice } from "@/hooks/useGasEstimate";

export function GasTracker() {
  const { data, isLoading, error } = useBaseGasPrice();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg animate-pulse">
        <div className="w-4 h-4 bg-white/10 rounded" />
        <div className="w-16 h-4 bg-white/10 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  // Determine gas status based on price
  const getGasStatus = () => {
    if (data.gwei < 0.01) return { label: 'Very Low', color: 'text-green-400', bg: 'bg-green-500' };
    if (data.gwei < 0.1) return { label: 'Low', color: 'text-green-400', bg: 'bg-green-500' };
    if (data.gwei < 1) return { label: 'Normal', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { label: 'High', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const status = getGasStatus();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
      <div className="flex items-center gap-1.5">
        <svg 
          className="w-4 h-4 text-white/60" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
        <span className="text-white/60 text-xs">Gas:</span>
      </div>
      <span className={`text-xs font-medium ${status.color}`}>
        {data.formatted}
      </span>
      <div className={`w-1.5 h-1.5 rounded-full ${status.bg}`} />
    </div>
  );
}

/**
 * Detailed gas info panel
 */
export function GasInfoPanel() {
  const { data, isLoading } = useBaseGasPrice();

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg 
          className="w-5 h-5 text-forge-orange" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
        <h3 className="text-white font-semibold">Base Gas Prices</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-8 bg-white/10 rounded animate-pulse" />
          <div className="h-8 bg-white/10 rounded animate-pulse" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Current Price</span>
            <span className="text-white font-mono">{data?.formatted || 'N/A'}</span>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/50 text-sm">
              Base L2 offers significantly lower gas fees compared to Ethereum mainnet, 
              typically 100x cheaper. Perfect for deploying tokens!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-500/10 rounded-lg p-2">
              <p className="text-green-400 text-xs">Low</p>
              <p className="text-white text-sm font-medium">&lt;0.01 Gwei</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-2">
              <p className="text-yellow-400 text-xs">Normal</p>
              <p className="text-white text-sm font-medium">0.01-0.1 Gwei</p>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2">
              <p className="text-red-400 text-xs">High</p>
              <p className="text-white text-sm font-medium">&gt;0.1 Gwei</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
