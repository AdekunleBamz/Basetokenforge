"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface GasEstimateProps {
  gasEstimate?: bigint;
  gasPrice?: bigint;
  isLoading?: boolean;
  className?: string;
}

export function GasEstimate({
  gasEstimate,
  gasPrice,
  isLoading = false,
  className,
}: GasEstimateProps) {
  const gasCostWei = gasEstimate && gasPrice ? gasEstimate * gasPrice : BigInt(0);
  const gasCostEth = Number(gasCostWei) / 1e18;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10',
        className
      )}
    >
      <svg
        className="w-4 h-4 text-yellow-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
        />
      </svg>
      
      <span className="text-xs text-white/60">Est. Gas:</span>
      
      {isLoading ? (
        <div className="w-16 h-4 bg-white/10 animate-pulse rounded" />
      ) : (
        <span className="text-sm font-medium text-white">
          {gasCostEth > 0 ? `~${gasCostEth.toFixed(6)} ETH` : 'Calculating...'}
        </span>
      )}
    </div>
  );
}
