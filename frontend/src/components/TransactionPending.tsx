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
    <div className={cn('flex flex-col items-center py-8', className)}>
      {/* Loading animation */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-forge-orange animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-white/5" />
        <div className="absolute inset-2 rounded-full border-2 border-t-forge-orange/50 animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>

      <p className="text-white font-medium mb-2">{message}</p>
      <p className="text-white/40 text-sm mb-4">Please wait while we confirm your transaction</p>

      {txHash && (
        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-forge-orange hover:text-forge-orange/80 transition-colors"
        >
          View on Basescan →
        </a>
      )}
    </div>
  );
}
