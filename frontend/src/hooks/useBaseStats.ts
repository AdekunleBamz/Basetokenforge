/**
 * Base L2 Statistics Hook
 * 
 * Fetches real-time statistics about the Base network.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { base } from "wagmi/chains";
import { formatEther, formatGwei } from "viem";

interface BaseStats {
  // Block info
  blockNumber: number;
  blockTime: number;
  
  // Gas info
  gasPrice: bigint;
  gasPriceGwei: string;
  baseFee: bigint;
  baseFeeGwei: string;
  
  // Network status
  isHealthy: boolean;
  lastUpdated: Date;
}

interface UseBaseStatsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useBaseStats(options: UseBaseStatsOptions = {}) {
  const { refreshInterval = 15000, enabled = true } = options;

  const publicClient = usePublicClient({ chainId: base.id });

  const [stats, setStats] = useState<BaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!publicClient) {
      setError(new Error('Public client not available'));
      return;
    }

    try {
      // Fetch latest block and gas price in parallel
      const [block, gasPrice] = await Promise.all([
        publicClient.getBlock({ blockTag: 'latest' }),
        publicClient.getGasPrice(),
      ]);

      const baseFee = block.baseFeePerGas || BigInt(0);

      setStats({
        blockNumber: Number(block.number),
        blockTime: Number(block.timestamp),
        gasPrice,
        gasPriceGwei: formatGwei(gasPrice),
        baseFee,
        baseFeeGwei: formatGwei(baseFee),
        isHealthy: true,
        lastUpdated: new Date(),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      if (stats) {
        setStats(prev => prev ? { ...prev, isHealthy: false } : null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, stats]);

  useEffect(() => {
    if (!enabled) return;

    fetchStats();

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval, enabled]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Get transaction cost estimate on Base vs Ethereum
 */
export function useL2Savings(gasUsed: bigint) {
  const { stats } = useBaseStats();

  // Approximate Ethereum gas price (typically 20-50 gwei)
  const ethGasPrice = BigInt(30e9); // 30 gwei as reference

  const baseCost = stats ? gasUsed * stats.gasPrice : BigInt(0);
  const ethCost = gasUsed * ethGasPrice;
  const savings = ethCost - baseCost;
  const savingsPercent = ethCost > 0 
    ? Number((savings * BigInt(100)) / ethCost)
    : 0;

  return {
    baseCost,
    baseCostEth: formatEther(baseCost),
    ethCost,
    ethCostEth: formatEther(ethCost),
    savings,
    savingsEth: formatEther(savings),
    savingsPercent,
  };
}

/**
 * Format block time to human readable
 */
export function formatBlockTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Get network health status
 */
export function getNetworkHealthColor(isHealthy: boolean, lastUpdated: Date): string {
  if (!isHealthy) return 'text-red-400';
  
  const msSinceUpdate = Date.now() - lastUpdated.getTime();
  if (msSinceUpdate > 30000) return 'text-yellow-400';
  
  return 'text-green-400';
}
