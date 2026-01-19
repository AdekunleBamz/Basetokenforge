/**
 * Wallet Balance Display Component
 * 
 * Shows the connected wallet's ETH balance on Base.
 */

"use client";

import { useWalletConnection } from "@/hooks/useWalletConnection";

interface WalletBalanceProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function WalletBalance({
  className = '',
  showLabel = true,
  variant = 'default',
}: WalletBalanceProps) {
  const { 
    isConnected, 
    balanceFormatted, 
    isLoadingBalance,
    isOnCorrectNetwork,
    networkName,
  } = useWalletConnection();

  if (!isConnected) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        {isLoadingBalance ? (
          <span className="w-16 h-4 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="font-mono text-white/80">{balanceFormatted || '0 ETH'}</span>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">Your Balance</span>
          <span className="text-xs text-white/40">{networkName}</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          {isLoadingBalance ? (
            <span className="w-32 h-8 bg-white/10 rounded animate-pulse" />
          ) : (
            <>
              <span className="text-2xl font-bold text-white font-mono">
                {balanceFormatted?.split(' ')[0] || '0'}
              </span>
              <span className="text-white/60">ETH</span>
            </>
          )}
        </div>

        {!isOnCorrectNetwork && (
          <p className="mt-3 text-xs text-yellow-400">
            ⚠️ Please switch to Base network
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/40">
            Gas fees on Base are typically under $0.01
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm text-white/60">Balance:</span>
      )}
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
        {/* ETH icon */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1.5l-8 13.5 8 4.5 8-4.5-8-13.5zm0 18l-8-4.5 8 7 8-7-8 4.5z" />
          </svg>
        </div>
        
        {isLoadingBalance ? (
          <span className="w-20 h-5 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="font-mono font-medium text-white">
            {balanceFormatted || '0 ETH'}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Mini balance indicator for header
 */
export function MiniBalance() {
  const { isConnected, balanceFormatted, isLoadingBalance } = useWalletConnection();

  if (!isConnected) return null;

  return (
    <span className="text-sm font-mono text-white/70">
      {isLoadingBalance ? '...' : balanceFormatted}
    </span>
  );
}

/**
 * Low balance warning component
 */
export function LowBalanceWarning({ threshold = 0.001 }: { threshold?: number }) {
  const { isConnected, balance } = useWalletConnection();

  if (!isConnected || !balance) return null;

  const balanceNum = parseFloat(balance);
  if (balanceNum >= threshold) return null;

  return (
    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
      <svg
        className="w-5 h-5 text-yellow-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <p className="text-sm text-yellow-400 font-medium">Low ETH Balance</p>
        <p className="text-xs text-white/60 mt-1">
          You may need more ETH to cover gas fees. Consider bridging funds to Base.
        </p>
      </div>
    </div>
  );
}
