"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface PriceTagProps {
  amount: string | number;
  currency?: string;
  discount?: number;
  className?: string;
}

export function PriceTag({
  amount,
  currency = 'ETH',
  discount,
  className,
}: PriceTagProps) {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const originalAmount = discount ? numericAmount / (1 - discount / 100) : numericAmount;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-bold text-lg text-white">
        {numericAmount.toFixed(4)} {currency}
      </span>
      {discount && (
        <>
          <span className="text-sm text-white/40 line-through">
            {originalAmount.toFixed(4)} {currency}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
