"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/number';

interface TokenStatsRowProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
  className?: string;
}

export function TokenStatsRow({
  label,
  value,
  prefix = '',
  suffix = '',
  isLoading = false,
  className,
}: TokenStatsRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 border-b border-white/10 last:border-0',
        className
      )}
    >
      <span className="text-white/60">{label}</span>
      {isLoading ? (
        <div className="w-24 h-5 bg-white/10 animate-pulse rounded" />
      ) : (
        <span className="font-medium text-white">
          {prefix}
          {typeof value === 'number' ? formatNumber(value) : value}
          {suffix}
        </span>
      )}
    </div>
  );
}

interface TokenStatsProps {
  totalSupply: string | number;
  decimals: number;
  holders?: number;
  transfers?: number;
  isLoading?: boolean;
  className?: string;
}

export function TokenStats({
  totalSupply,
  decimals,
  holders,
  transfers,
  isLoading = false,
  className,
}: TokenStatsProps) {
  return (
    <div className={cn('rounded-xl bg-white/5 border border-white/10 p-4', className)}>
      <TokenStatsRow label="Total Supply" value={totalSupply} isLoading={isLoading} />
      <TokenStatsRow label="Decimals" value={decimals} isLoading={isLoading} />
      {holders !== undefined && (
        <TokenStatsRow label="Holders" value={holders} isLoading={isLoading} />
      )}
      {transfers !== undefined && (
        <TokenStatsRow label="Transfers" value={transfers} isLoading={isLoading} />
      )}
    </div>
  );
}
