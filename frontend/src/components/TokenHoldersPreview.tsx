'use client';

/**
 * Token Holders Preview Component
 * 
 * Shows a preview of top token holders with visual distribution.
 * Links to full holder list on Basescan.
 */

import { useState, useEffect } from 'react';
import { Users, ExternalLink, Crown, TrendingUp, Loader2 } from 'lucide-react';
import { getTokenUrl } from '@/lib/base-network';
import type { Address } from 'viem';

interface TokenHolder {
  address: Address;
  balance: string;
  percentage: number;
  rank: number;
}

interface TokenHoldersPreviewProps {
  /** Token contract address */
  tokenAddress: Address;
  /** Total token supply */
  totalSupply: string;
  /** Token symbol */
  tokenSymbol: string;
  /** Chain ID */
  chainId: number;
  /** Number of holders to show */
  limit?: number;
  /** Mock data for demo (since we can't query holders directly) */
  mockHolders?: TokenHolder[];
  /** Additional CSS classes */
  className?: string;
}

// Default mock data showing creator ownership
const createMockHolders = (creatorAddress: string): TokenHolder[] => [
  {
    address: creatorAddress as Address,
    balance: '100%',
    percentage: 100,
    rank: 1,
  },
];

export function TokenHoldersPreview({
  tokenAddress,
  totalSupply,
  tokenSymbol,
  chainId,
  limit = 5,
  mockHolders,
  className = '',
}: TokenHoldersPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Use mock data or empty state (real holder data would need indexer API)
  const holders = mockHolders || [];

  // Get color for holder rank
  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-300';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-gray-500';
    }
  };

  // Get progress bar color based on percentage
  const getBarColor = (percentage: number): string => {
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-blue-500';
    if (percentage >= 10) return 'bg-green-500';
    return 'bg-gray-500';
  };

  // Shorten address for display
  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800/50 rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading holders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-white">Token Holders</h3>
        </div>
        <a
          href={`${getTokenUrl(tokenAddress, chainId)}#balances`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          View All <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Holders List */}
      <div className="p-4">
        {holders.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-10 w-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">
              Holder data will be available on Basescan
            </p>
            <a
              href={`${getTokenUrl(tokenAddress, chainId)}#balances`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-2"
            >
              View on Basescan <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {holders.slice(0, limit).map((holder) => (
              <div key={holder.address} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Rank */}
                    <span className={`font-bold text-sm ${getRankColor(holder.rank)}`}>
                      #{holder.rank}
                    </span>
                    {holder.rank === 1 && (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    )}
                    {/* Address */}
                    <a
                      href={`${getTokenUrl(tokenAddress, chainId)}?a=${holder.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-gray-300 hover:text-blue-400"
                    >
                      {shortenAddress(holder.address)}
                    </a>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">{holder.percentage.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(holder.percentage)} transition-all duration-500`}
                    style={{ width: `${Math.min(100, holder.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-t border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span>Total Supply:</span>
        </div>
        <span className="text-white font-medium text-sm">
          {parseFloat(totalSupply).toLocaleString()} {tokenSymbol}
        </span>
      </div>
    </div>
  );
}

/**
 * Holder Distribution Bar
 * 
 * Visual representation of token distribution
 */
export function HolderDistributionBar({
  holders,
  className = '',
}: {
  holders: { percentage: number; color: string }[];
  className?: string;
}) {
  return (
    <div className={`h-3 bg-gray-700 rounded-full overflow-hidden flex ${className}`}>
      {holders.map((holder, idx) => (
        <div
          key={idx}
          className={`h-full ${holder.color}`}
          style={{ width: `${holder.percentage}%` }}
          title={`${holder.percentage.toFixed(2)}%`}
        />
      ))}
    </div>
  );
}

export default TokenHoldersPreview;
