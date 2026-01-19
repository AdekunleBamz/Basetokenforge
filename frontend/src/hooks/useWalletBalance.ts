/**
 * Wallet Balance Hook for Base Chain
 * 
 * Fetches and tracks ETH and token balances with real-time updates.
 * Optimized for Base L2 with fast block times.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import type { Address } from 'viem';
import { formatEther, formatUnits } from 'viem';

// ERC20 Balance ABI
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

export interface TokenBalance {
  /** Token contract address */
  address: Address;
  /** Token symbol */
  symbol: string;
  /** Token decimals */
  decimals: number;
  /** Raw balance in wei */
  balance: bigint;
  /** Formatted balance */
  balanceFormatted: string;
  /** Display balance (shortened) */
  balanceDisplay: string;
}

export interface UseWalletBalanceReturn {
  /** Native ETH balance in wei */
  ethBalance: bigint | null;
  /** Formatted ETH balance */
  ethBalanceFormatted: string;
  /** Display ETH balance (shortened) */
  ethBalanceDisplay: string;
  /** Token balances */
  tokenBalances: Map<Address, TokenBalance>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refresh all balances */
  refresh: () => Promise<void>;
  /** Fetch specific token balance */
  fetchTokenBalance: (tokenAddress: Address) => Promise<TokenBalance | null>;
  /** Has enough ETH for gas */
  hasGasBalance: boolean;
}

// Minimum ETH required for gas on Base (very low due to L2)
const MIN_GAS_BALANCE = 0.0001; // 0.0001 ETH

/**
 * Hook for tracking wallet balances on Base chain
 */
export function useWalletBalance(
  watchTokens: Address[] = [],
  refreshInterval = 30000
): UseWalletBalanceReturn {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  
  // Native ETH balance
  const {
    data: ethBalanceData,
    isLoading: isEthLoading,
    refetch: refetchEth,
  } = useBalance({
    address: account,
  });

  const [tokenBalances, setTokenBalances] = useState<Map<Address, TokenBalance>>(new Map());
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch single token balance
  const fetchTokenBalance = useCallback(
    async (tokenAddress: Address): Promise<TokenBalance | null> => {
      if (!publicClient || !account) {
        return null;
      }

      try {
        const [balance, decimals, symbol] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [account],
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'symbol',
          }),
        ]);

        const balanceFormatted = formatUnits(balance, decimals);
        const balanceDisplay = formatBalanceDisplay(parseFloat(balanceFormatted));

        const tokenBalance: TokenBalance = {
          address: tokenAddress,
          symbol,
          decimals,
          balance,
          balanceFormatted,
          balanceDisplay,
        };

        setTokenBalances((prev) => {
          const next = new Map(prev);
          next.set(tokenAddress, tokenBalance);
          return next;
        });

        return tokenBalance;
      } catch (err) {
        console.error(`Failed to fetch balance for ${tokenAddress}:`, err);
        return null;
      }
    },
    [publicClient, account]
  );

  // Fetch all watched token balances
  const fetchAllTokenBalances = useCallback(async () => {
    if (!publicClient || !account || watchTokens.length === 0) {
      return;
    }

    setIsLoadingTokens(true);
    setError(null);

    try {
      await Promise.all(watchTokens.map(fetchTokenBalance));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch token balances'));
    } finally {
      setIsLoadingTokens(false);
    }
  }, [publicClient, account, watchTokens, fetchTokenBalance]);

  // Refresh all balances
  const refresh = useCallback(async () => {
    await Promise.all([refetchEth(), fetchAllTokenBalances()]);
  }, [refetchEth, fetchAllTokenBalances]);

  // Initial fetch and watch tokens changes
  useEffect(() => {
    if (account) {
      fetchAllTokenBalances();
    }
  }, [account, fetchAllTokenBalances]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  // Format ETH balance
  const ethBalance = ethBalanceData?.value ?? null;
  const ethBalanceFormatted = ethBalance ? formatEther(ethBalance) : '0';
  const ethBalanceDisplay = formatBalanceDisplay(parseFloat(ethBalanceFormatted));

  // Check if has enough for gas
  const hasGasBalance = ethBalance 
    ? parseFloat(formatEther(ethBalance)) >= MIN_GAS_BALANCE 
    : false;

  return {
    ethBalance,
    ethBalanceFormatted,
    ethBalanceDisplay,
    tokenBalances,
    isLoading: isEthLoading || isLoadingTokens,
    error,
    refresh,
    fetchTokenBalance,
    hasGasBalance,
  };
}

/**
 * Format balance for display with abbreviations
 */
export function formatBalanceDisplay(value: number): string {
  if (value === 0) return '0';
  
  if (value < 0.0001) return '< 0.0001';
  
  if (value < 1) return value.toFixed(4);
  
  if (value < 1000) return value.toFixed(2);
  
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  
  return value.toLocaleString();
}

/**
 * Check if balance is low (below threshold)
 */
export function isLowBalance(balance: bigint, threshold: bigint): boolean {
  return balance < threshold;
}

/**
 * Calculate percentage of total supply
 */
export function calculateHoldingPercentage(balance: bigint, totalSupply: bigint): string {
  if (totalSupply === 0n) return '0';
  
  const percentage = Number((balance * 10000n) / totalSupply) / 100;
  
  if (percentage < 0.01) return '< 0.01%';
  
  return `${percentage.toFixed(2)}%`;
}

export default useWalletBalance;
