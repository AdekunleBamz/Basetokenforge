"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { TokenIcon } from './TokenIcon';
import { CopyAddressButton } from './CopyAddressButton';

interface TokenHeaderProps {
  name: string;
  symbol: string;
  address: string;
  imageUrl?: string;
  className?: string;
}

export function TokenHeader({
  name,
  symbol,
  address,
  imageUrl,
  className,
}: TokenHeaderProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <TokenIcon symbol={symbol} size="lg" imageUrl={imageUrl} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-xl text-white truncate">
            {name}
          </h2>
          <span className="text-white/40 text-lg">${symbol}</span>
        </div>
        <CopyAddressButton address={address} />
      </div>
    </div>
  );
}
