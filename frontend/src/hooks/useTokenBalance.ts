/**
 * useTokenBalance Hook
 * 
 * Fetches and tracks token balance for an address on Base.
 */

"use client";

import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ERC20_ABI } from "@/config/abi";

interface TokenBalanceResult {
  balance: bigint;
  formattedBalance: string;
  symbol: string;
  decimals: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTokenBalance(
  tokenAddress: `0x${string}` | null,
  ownerAddress: `0x${string}` | null
): TokenBalanceResult {
  // Fetch balance
  const { 
    data: balance, 
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address: tokenAddress || undefined,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!ownerAddress,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Fetch decimals
  const { data: decimals, isLoading: isDecimalsLoading } = useReadContract({
    address: tokenAddress || undefined,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: {
      enabled: !!tokenAddress,
    },
  });

  // Fetch symbol
  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    address: tokenAddress || undefined,
    abi: ERC20_ABI,
    functionName: "symbol",
    query: {
      enabled: !!tokenAddress,
    },
  });

  const tokenDecimals = (decimals as number) || 18;
  const tokenBalance = (balance as bigint) || 0n;
  const formattedBalance = formatUnits(tokenBalance, tokenDecimals);

  return {
    balance: tokenBalance,
    formattedBalance,
    symbol: (symbol as string) || "",
    decimals: tokenDecimals,
    isLoading: isBalanceLoading || isDecimalsLoading || isSymbolLoading,
    error: balanceError as Error | null,
    refetch: refetchBalance,
  };
}

/**
 * Hook to get multiple token balances at once
 */
export function useMultipleTokenBalances(
  tokenAddresses: `0x${string}`[],
  ownerAddress: `0x${string}` | null
) {
  // This would use useReadContracts for batch fetching
  // Simplified implementation for now
  return {
    balances: [] as { address: string; balance: string }[],
    isLoading: false,
    error: null,
  };
}
