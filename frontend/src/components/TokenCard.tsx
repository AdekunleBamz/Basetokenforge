"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';
import { IconExternalLink } from '@/components/icons';
import { formatNumber } from '@/lib/utils/number';
import { getTokenUrl } from '@/lib/utils/blockchain';
import { formatUnits } from 'viem';
import type { TokenInfo } from '@/types';

interface TokenCardProps {
  token: TokenInfo;
  className?: string;
}

export function TokenCard({ token, className }: TokenCardProps) {
  const formattedSupply = token.totalSupply && token.decimals !== undefined
    ? formatNumber(formatUnits(token.totalSupply, token.decimals))
    : '...';

  return (
    <Card variant="interactive" className={className}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Token Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center font-bold text-lg text-base-dark shrink-0">
          {token.symbol?.charAt(0) || '?'}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-lg text-white truncate">
              {token.name || 'Loading...'}
            </h3>
            {token.decimals !== undefined && (
              <Badge variant="default" size="sm">
                {token.decimals} decimals
              </Badge>
            )}
          </div>
          <p className="text-white/60 text-sm mt-1">
            <span className="font-medium text-forge-orange">{token.symbol || '...'}</span>
            {' • '}
            {formattedSupply} supply
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={getTokenUrl(token.address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<IconExternalLink size={14} />}
            >
              Basescan
            </Button>
          </a>
          <CopyButton text={token.address} showText size="sm" />
        </div>
      </div>
    </Card>
  );
}

// Empty state
export function TokenCardEmpty({ className }: { className?: string }) {
  return (
    <Card className={cn('text-center py-12', className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-white mb-2">
        No tokens yet
      </h3>
      <p className="text-white/60 mb-6">
        Create your first token to see it here
      </p>
      <a href="#create">
        <Button variant="primary">Create Token</Button>
      </a>
    </Card>
  );
}
