'use client';

/**
 * Wallet Balance Card Component
 * 
 * Displays ETH and token balances in a clean card format.
 * Optimized for Base chain with quick balance refresh.
 */

import { useState } from 'react';
import { Wallet, RefreshCw, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useWalletBalance, formatBalanceDisplay } from '@/hooks/useWalletBalance';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';

interface WalletBalanceCardProps {
  /** Token addresses to watch */
  watchTokens?: Address[];
  /** Show ETH balance */
  showEth?: boolean;
  /** Current ETH price in USD */
  ethPrice?: number;
  /** Card title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

export function WalletBalanceCard({
  watchTokens = [],
  showEth = true,
  ethPrice,
  title = 'Wallet Balance',
  className = '',
}: WalletBalanceCardProps) {
  const { address, isConnected } = useAccount();
  const {
    ethBalance,
    ethBalanceFormatted,
    ethBalanceDisplay,
    tokenBalances,
    isLoading,
    refresh,
    hasGasBalance,
  } = useWalletBalance(watchTokens);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate ETH value in USD
  const ethValueUsd = ethPrice && ethBalanceFormatted
    ? (parseFloat(ethBalanceFormatted) * ethPrice).toFixed(2)
    : null;

  if (!isConnected) {
    return (
      <div className={`rounded-xl border border-gray-700 bg-gray-800/50 p-6 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Wallet className="h-5 w-5" />
          <span>Connect wallet to view balance</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Refresh balances"
        >
          <RefreshCw className={`h-4 w-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Balances */}
      <div className="p-4 space-y-4">
        {/* ETH Balance */}
        {showEth && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* ETH Logo */}
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">Ξ</span>
              </div>
              <div>
                <p className="text-white font-medium">Ethereum</p>
                <p className="text-gray-400 text-sm">ETH on Base</p>
              </div>
            </div>
            <div className="text-right">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-5 w-20 bg-gray-700 rounded mb-1" />
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </div>
              ) : (
                <>
                  <p className="text-white font-semibold">{ethBalanceDisplay} ETH</p>
                  {ethValueUsd && (
                    <p className="text-gray-400 text-sm">${ethValueUsd}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Low Gas Warning */}
        {showEth && !hasGasBalance && !isLoading && (
          <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <TrendingDown className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm">
              Low ETH for gas. Consider adding more ETH on Base.
            </span>
          </div>
        )}

        {/* Token Balances */}
        {tokenBalances.size > 0 && (
          <div className="space-y-3 pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-400">Tokens</p>
            {Array.from(tokenBalances.values()).map((token) => (
              <div key={token.address} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Token Logo Placeholder */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{token.symbol}</p>
                    <a
                      href={`https://basescan.org/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 text-xs hover:text-blue-400 flex items-center gap-1"
                    >
                      View on Basescan
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{token.balanceDisplay}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Token State */}
        {watchTokens.length > 0 && tokenBalances.size === 0 && !isLoading && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No token balances found
          </div>
        )}
      </div>

      {/* Address Footer */}
      {address && (
        <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Wallet</span>
            <span className="text-gray-300 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Mini Balance Display Component
 */
export function MiniBalanceDisplay({ className = '' }: { className?: string }) {
  const { ethBalanceDisplay, isLoading } = useWalletBalance();
  const { isConnected } = useAccount();

  if (!isConnected) return null;

  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      <span className="text-blue-400 font-bold">Ξ</span>
      {isLoading ? (
        <span className="text-gray-400">...</span>
      ) : (
        <span className="text-gray-300">{ethBalanceDisplay}</span>
      )}
    </div>
  );
}

export default WalletBalanceCard;
