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
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View Transaction on Basescan
        </a>
        {tokenAddress && (
          <a
            href={`https://basescan.org/token/${tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-forge-orange/10 hover:bg-forge-orange/20 border border-forge-orange/30 text-forge-orange transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Token Contract
          </a>
        )}
      </div>

      {/* Confetti message */}
      <p className="text-white/40 text-sm mt-6">
        Your token is ready to use! Share it with your community 🚀
      </p>
    </div>
  );
}
