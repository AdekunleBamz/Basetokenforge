"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TransactionSuccessProps {
  tokenName: string;
  tokenSymbol: string;
  txHash: string;
  tokenAddress?: string;
  className?: string;
}

export function TransactionSuccess({
  tokenName,
  tokenSymbol,
  txHash,
  tokenAddress,
  className,
}: TransactionSuccessProps) {
  return (
    <div className={cn('text-center py-8', className)}>
      {/* Success animation */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        <div className="relative w-full h-full rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h3 className="font-display font-bold text-2xl text-white mb-2">
        Token Created! 🎉
      </h3>
      <p className="text-white/60 mb-6">
        <span className="text-forge-orange font-medium">{tokenName}</span>
        {' '}({tokenSymbol}) is now live on Base
      </p>

      <div className="space-y-3 max-w-md mx-auto">
        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          View Transaction on Basescan →
        </a>
        {tokenAddress && (
          <a
            href={`https://basescan.org/token/${tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 rounded-xl bg-forge-orange/10 hover:bg-forge-orange/20 border border-forge-orange/30 text-forge-orange transition-colors"
          >
            View Token Contract →
          </a>
        )}
      </div>
    </div>
  );
}
