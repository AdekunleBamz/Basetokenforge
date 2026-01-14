"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TokenPreviewProps {
  name: string;
  symbol: string;
  initialSupply: string;
  decimals?: number;
  className?: string;
}

export function TokenPreview({
  name,
  symbol,
  initialSupply,
  decimals = 18,
  className,
}: TokenPreviewProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
        className
      )}
    >
      <h4 className="text-sm font-medium text-white/60 mb-4">Token Preview</h4>
      
      <div className="flex items-center gap-4 mb-6">
        {/* Token avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forge-orange to-forge-orange/60 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {symbol.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-white">{name || 'Token Name'}</h3>
          <p className="text-white/60">${symbol || 'SYMBOL'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-white/40 mb-1">Initial Supply</p>
          <p className="text-white font-medium">
            {initialSupply ? Number(initialSupply).toLocaleString() : '0'} {symbol}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-white/40 mb-1">Decimals</p>
          <p className="text-white font-medium">{decimals}</p>
        </div>
      </div>
    </div>
  );
}
