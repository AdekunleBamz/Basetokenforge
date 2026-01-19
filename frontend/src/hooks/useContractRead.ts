/**
 * useContractRead Hook
 * 
 * Wrapper hook for reading from Base contracts with caching and error handling.
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useChainId } from 'wagmi';
import { type Address, type Abi } from 'viem';
import { CHAIN_IDS } from '../lib/constants';

interface UseContractReadOptions<TAbi extends Abi, TFunctionName extends string> {
  address?: Address;
  abi: TAbi;
  functionName: TFunctionName;
  args?: readonly unknown[];
  enabled?: boolean;
  watch?: boolean;
  pollingInterval?: number;
  cacheTime?: number;
}

interface UseContractReadReturn<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const DEFAULT_POLLING_INTERVAL = 5000;
const DEFAULT_CACHE_TIME = 30000;

// Simple in-memory cache
const readCache = new Map<string, { data: unknown; timestamp: number }>();

export function useContractRead<
  TAbi extends Abi,
  TFunctionName extends string,
  TData = unknown
>(
  options: UseContractReadOptions<TAbi, TFunctionName>
): UseContractReadReturn<TData> {
  const {
    address,
    abi,
    functionName,
    args = [],
    enabled = true,
    watch = false,
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    cacheTime = DEFAULT_CACHE_TIME,
  } = options;

  const chainId = useChainId();
  const publicClient = usePublicClient();

  const [data, setData] = useState<TData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create cache key
  const cacheKey = `${chainId}-${address}-${functionName}-${JSON.stringify(args)}`;

  const fetchData = useCallback(async () => {
    if (!address || !publicClient || !enabled) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cached = readCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data as TData);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await publicClient.readContract({
        address,
        abi,
        functionName,
        args,
      });

      // Update cache
      readCache.set(cacheKey, { data: result, timestamp: Date.now() });

      setData(result as TData);
    } catch (err) {
      console.error(`Contract read error (${functionName}):`, err);
      setError(err instanceof Error ? err : new Error('Contract read failed'));
    } finally {
      setIsLoading(false);
    }
  }, [address, abi, functionName, args, publicClient, enabled, cacheKey, cacheTime]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling for watch mode
  useEffect(() => {
    if (!watch || !enabled) return;

    const intervalId = setInterval(fetchData, pollingInterval);
    return () => clearInterval(intervalId);
  }, [watch, enabled, pollingInterval, fetchData]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for reading token information
 */
interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

const ERC20_ABI = [
  { type: 'function', name: 'name', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const;

export function useTokenInfo(tokenAddress?: Address) {
  const publicClient = usePublicClient();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tokenAddress || !publicClient) {
      setIsLoading(false);
      return;
    }

    const fetchTokenInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all token info in parallel
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'name',
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'symbol',
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'totalSupply',
          }),
        ]);

        setTokenInfo({
          name: name as string,
          symbol: symbol as string,
          decimals: decimals as number,
          totalSupply: totalSupply as bigint,
        });
      } catch (err) {
        console.error('Failed to fetch token info:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch token info'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfo();
  }, [tokenAddress, publicClient]);

  return { tokenInfo, isLoading, error };
}

/**
 * Hook for reading token balance
 */
export function useTokenBalance(tokenAddress?: Address, ownerAddress?: Address) {
  const publicClient = usePublicClient();
  const [balance, setBalance] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!tokenAddress || !ownerAddress || !publicClient) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await publicClient.readContract({
        address: tokenAddress,
        abi: [
          {
            type: 'function',
            name: 'balanceOf',
            inputs: [{ type: 'address', name: 'account' }],
            outputs: [{ type: 'uint256' }],
            stateMutability: 'view',
          },
        ],
        functionName: 'balanceOf',
        args: [ownerAddress],
      });

      setBalance(result as bigint);
    } catch (err) {
      console.error('Failed to fetch token balance:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch balance'));
    } finally {
      setIsLoading(false);
    }
  }, [tokenAddress, ownerAddress, publicClient]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, error, refetch: fetchBalance };
}

/**
 * Check if connected to Base network
 */
export function useIsBaseNetwork(): { isBase: boolean; isTestnet: boolean } {
  const chainId = useChainId();

  return {
    isBase: chainId === CHAIN_IDS.BASE_MAINNET || chainId === CHAIN_IDS.BASE_SEPOLIA,
    isTestnet: chainId === CHAIN_IDS.BASE_SEPOLIA,
  };
}
