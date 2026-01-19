/**
 * Token List Component
 * 
 * Displays a list of tokens deployed on Base.
 */

"use client";

import { formatUnits } from "viem";
import { getTokenUrl } from "@/lib/base-chain";
import { truncateAddress } from "@/lib/formatting";
import type { TokenInfo } from "@/types";

interface TokenListProps {
  tokens: TokenInfo[];
  isLoading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  onTokenClick?: (token: TokenInfo) => void;
}

export function TokenList({ 
  tokens, 
  isLoading, 
  emptyMessage = "No tokens found",
  showActions = true,
  onTokenClick,
}: TokenListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <TokenListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-12">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <p className="text-white/50">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <TokenListItem
          key={token.address}
          token={token}
          showActions={showActions}
          onClick={onTokenClick ? () => onTokenClick(token) : undefined}
        />
      ))}
    </div>
  );
}

interface TokenListItemProps {
  token: TokenInfo;
  showActions?: boolean;
  onClick?: () => void;
}

function TokenListItem({ token, showActions = true, onClick }: TokenListItemProps) {
  const formattedSupply = token.totalSupply && token.decimals !== undefined
    ? formatUnits(token.totalSupply, token.decimals)
    : 'N/A';

  const displaySupply = formattedSupply !== 'N/A' 
    ? Number(formattedSupply).toLocaleString('en-US', { maximumFractionDigits: 2 })
    : 'N/A';

  return (
    <div 
      className={`bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Token Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center flex-shrink-0">
          <span className="text-base-dark font-bold text-lg">
            {token.symbol?.slice(0, 2) || '??'}
          </span>
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-semibold truncate">
              {token.name || 'Unknown Token'}
            </h4>
            <span className="text-white/50 text-sm">${token.symbol || '???'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/50">
              Supply: <span className="text-white/70">{displaySupply}</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/50 font-mono">
              {truncateAddress(token.address, 6, 4)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={getTokenUrl(token.address)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-white/50 hover:text-base-blue transition-colors"
              title="View on Basescan"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(token.address);
              }}
              className="p-2 text-white/50 hover:text-white transition-colors"
              title="Copy Address"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Base Badge */}
      <div className="mt-3 flex items-center gap-2">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-base-blue/10 text-base-blue text-xs rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-base-blue" />
          Base
        </div>
        <span className="text-white/30 text-xs">
          {token.decimals !== undefined ? `${token.decimals} decimals` : ''}
        </span>
      </div>
    </div>
  );
}

function TokenListItemSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-5 bg-white/10 rounded w-32 mb-2" />
          <div className="h-4 bg-white/10 rounded w-48" />
        </div>
      </div>
    </div>
  );
}
