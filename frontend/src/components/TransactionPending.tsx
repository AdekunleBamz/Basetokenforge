"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TransactionPendingProps {
  message?: string;
  txHash?: string;
  className?: string;
}

export function TransactionPending({
  message = 'Transaction in progress...',
  txHash,
  className,
}: TransactionPendingProps) {
  return (
    <div className={cn('flex flex-col items-center py-8', className)} role="status" aria-live="polite">
      {/* Loading animation */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-forge-orange animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-white/5" />
        <div className="absolute inset-2 rounded-full border-2 border-t-forge-orange/50 animate-spin" style={{ animationDuration: '1.5s' }} />
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-forge-orange/10 blur-xl animate-pulse" />
      </div>

      <p className="text-white font-medium mb-2">{message}</p>
      <p className="text-white/40 text-sm mb-4">Please wait while we confirm your transaction</p>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-white/60">Submitted</span>
        </div>
        <div className="w-4 h-px bg-white/20" />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-forge-orange animate-pulse" />
          <span className="text-xs text-white/60">Confirming</span>
        </div>
        <div className="w-4 h-px bg-white/20" />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-xs text-white/40">Complete</span>
        </div>
      </div>

      {txHash && (
        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-forge-orange hover:text-forge-orange/80 transition-colors flex items-center gap-1"
        >
          View on Basescan
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
