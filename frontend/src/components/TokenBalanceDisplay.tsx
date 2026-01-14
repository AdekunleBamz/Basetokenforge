"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/number';

interface TokenBalanceDisplayProps {
  balance: string | number;
  symbol: string;
  decimals?: number;
  showUSD?: boolean;
  usdValue?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: {
    wrapper: 'gap-1',
    balance: 'text-lg font-bold',
    symbol: 'text-sm',
    usd: 'text-xs',
  },
  md: {
    wrapper: 'gap-1.5',
    balance: 'text-2xl font-bold',
    symbol: 'text-base',
    usd: 'text-sm',
  },
  lg: {
    wrapper: 'gap-2',
    balance: 'text-4xl font-bold',
    symbol: 'text-xl',
    usd: 'text-base',
  },
};

export function TokenBalanceDisplay({
  balance,
  symbol,
  decimals = 18,
  showUSD = false,
  usdValue,
  size = 'md',
  className,
}: TokenBalanceDisplayProps) {
  const numericBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  const displayBalance = formatNumber(numericBalance, { decimals: Math.min(4, decimals) });
  const classes = SIZE_CLASSES[size];

  return (
    <div className={cn('flex flex-col', classes.wrapper, className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-white', classes.balance)}>
          {displayBalance}
        </span>
        <span className={cn('text-white/60 font-medium', classes.symbol)}>
          {symbol}
        </span>
      </div>
      {showUSD && usdValue !== undefined && (
        <span className={cn('text-white/40', classes.usd)}>
          ≈ ${formatNumber(usdValue, { decimals: 2 })}
        </span>
      )}
    </div>
  );
}
