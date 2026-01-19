/**
 * Base Chain Gas Fee Estimation Hook
 * 
 * Provides real-time gas fee estimates optimized for Base L2.
 * Base uses EIP-1559 with significantly lower fees than L1.
 */

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { formatGwei, formatEther } from 'viem';

export interface BaseFeeEstimate {
  /** Base fee in wei */
  baseFee: bigint;
  /** Priority fee in wei */
  priorityFee: bigint;
  /** Total gas price in wei */
  gasPrice: bigint;
  /** Base fee formatted in Gwei */
  baseFeeGwei: string;
  /** Priority fee formatted in Gwei */
  priorityFeeGwei: string;
  /** Gas price formatted in Gwei */
  gasPriceGwei: string;
}

export interface GasEstimation {
  /** Estimated gas units for the transaction */
  gasUnits: bigint;
  /** Estimated cost in wei */
  estimatedCostWei: bigint;
  /** Estimated cost in ETH */
  estimatedCostEth: string;
  /** Estimated cost in USD (if ETH price available) */
  estimatedCostUsd: string | null;
}

export interface UseBaseFeesReturn {
  /** Current fee estimates */
  feeEstimate: BaseFeeEstimate | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refresh fee estimates */
  refresh: () => Promise<void>;
  /** Calculate estimated cost for gas units */
  calculateCost: (gasUnits: bigint, ethPrice?: number) => GasEstimation;
  /** Last updated timestamp */
  lastUpdated: Date | null;
}

// Default gas estimates for common operations on Base
export const BASE_GAS_ESTIMATES = {
  /** ERC20 token creation via factory */
  tokenCreation: 2_500_000n,
  /** ERC20 transfer */
  transfer: 65_000n,
  /** ERC20 approve */
  approve: 46_000n,
  /** ERC20 transferFrom */
  transferFrom: 85_000n,
  /** Check balance (view, no gas) */
  balanceOf: 0n,
} as const;

// Base L2 specific fee constants
const BASE_L2_OVERHEAD = 2100n; // L1 data availability overhead
const DEFAULT_PRIORITY_FEE = 1_000_000n; // 0.001 Gwei default priority

/**
 * Hook for fetching and managing Base chain gas fees
 * 
 * @param refreshInterval - How often to refresh fees (ms), default 15s
 * @returns Fee estimates and utilities
 */
export function useBaseFees(refreshInterval = 15000): UseBaseFeesReturn {
  const publicClient = usePublicClient();
  
  const [feeEstimate, setFeeEstimate] = useState<BaseFeeEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFees = useCallback(async () => {
    if (!publicClient) {
      setError(new Error('No public client available'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch current block for base fee
      const block = await publicClient.getBlock({ blockTag: 'latest' });
      const baseFee = block.baseFeePerGas ?? 0n;
      
      // Use default priority fee for Base (typically very low)
      const priorityFee = DEFAULT_PRIORITY_FEE;
      
      // Calculate total gas price
      const gasPrice = baseFee + priorityFee;

      setFeeEstimate({
        baseFee,
        priorityFee,
        gasPrice,
        baseFeeGwei: formatGwei(baseFee),
        priorityFeeGwei: formatGwei(priorityFee),
        gasPriceGwei: formatGwei(gasPrice),
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch fees'));
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  // Calculate cost for given gas units
  const calculateCost = useCallback(
    (gasUnits: bigint, ethPrice?: number): GasEstimation => {
      const gasPrice = feeEstimate?.gasPrice ?? 0n;
      
      // Add L2 overhead for accurate estimation
      const totalGas = gasUnits + BASE_L2_OVERHEAD;
      const estimatedCostWei = totalGas * gasPrice;
      const estimatedCostEth = formatEther(estimatedCostWei);
      
      let estimatedCostUsd: string | null = null;
      if (ethPrice) {
        const costUsd = parseFloat(estimatedCostEth) * ethPrice;
        estimatedCostUsd = `$${costUsd.toFixed(4)}`;
      }

      return {
        gasUnits: totalGas,
        estimatedCostWei,
        estimatedCostEth,
        estimatedCostUsd,
      };
    },
    [feeEstimate]
  );

  // Initial fetch
  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchFees, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchFees, refreshInterval]);

  return {
    feeEstimate,
    isLoading,
    error,
    refresh: fetchFees,
    calculateCost,
    lastUpdated,
  };
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gasPriceWei: bigint): string {
  const gwei = parseFloat(formatGwei(gasPriceWei));
  
  if (gwei < 0.001) {
    return '< 0.001 Gwei';
  }
  
  if (gwei < 1) {
    return `${gwei.toFixed(4)} Gwei`;
  }
  
  return `${gwei.toFixed(2)} Gwei`;
}

/**
 * Compare Base fees to Ethereum L1 for savings display
 */
export function calculateL2Savings(
  baseGasPrice: bigint,
  l1GasPrice: bigint,
  gasUnits: bigint
): { savingsPercent: number; savingsEth: string } {
  const baseCost = baseGasPrice * gasUnits;
  const l1Cost = l1GasPrice * gasUnits;
  
  if (l1Cost === 0n) {
    return { savingsPercent: 0, savingsEth: '0' };
  }
  
  const savings = l1Cost - baseCost;
  const savingsPercent = Number((savings * 10000n) / l1Cost) / 100;
  
  return {
    savingsPercent,
    savingsEth: formatEther(savings),
  };
}

export default useBaseFees;
