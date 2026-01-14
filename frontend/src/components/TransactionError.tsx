"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface TransactionErrorProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function TransactionError({
  error,
  onRetry,
  onDismiss,
  className,
}: TransactionErrorProps) {
  return (
    <div className={cn('text-center py-8', className)}>
      {/* Error icon */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h3 className="font-display font-bold text-xl text-white mb-2">
        Transaction Failed
      </h3>
      <p className="text-white/60 mb-6 max-w-sm mx-auto text-sm">
        {error || 'An error occurred while processing your transaction.'}
      </p>

      <div className="flex items-center justify-center gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}
