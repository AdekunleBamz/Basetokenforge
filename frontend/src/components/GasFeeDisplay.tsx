'use client';

/**
 * Gas Fee Display Component
 * 
 * Shows current Base L2 gas fees with real-time updates.
 * Highlights the low-cost advantage of Base compared to L1.
 */

import { useEffect, useState } from 'react';
import { useBaseFees, formatGasPrice, calculateL2Savings, BASE_GAS_ESTIMATES } from '@/hooks/useBaseFees';
import { Fuel, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';

interface GasFeeDisplayProps {
  /** Show estimated cost for token creation */
  showCreationEstimate?: boolean;
  /** Current ETH price in USD (for cost calculation) */
  ethPrice?: number;
  /** Compact mode for smaller displays */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function GasFeeDisplay({
  showCreationEstimate = true,
  ethPrice,
  compact = false,
  className = '',
}: GasFeeDisplayProps) {
  const { feeEstimate, isLoading, error, refresh, calculateCost, lastUpdated } = useBaseFees(15000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate token creation cost estimate
  const creationCost = feeEstimate 
    ? calculateCost(BASE_GAS_ESTIMATES.tokenCreation, ethPrice)
    : null;

  // Simulated L1 comparison (L1 typically 20-50x more expensive)
  const estimatedL1GasPrice = feeEstimate ? feeEstimate.gasPrice * 30n : 0n;
  const savings = feeEstimate
    ? calculateL2Savings(
        feeEstimate.gasPrice,
        estimatedL1GasPrice,
        BASE_GAS_ESTIMATES.tokenCreation
      )
    : null;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Fuel className="h-4 w-4 text-blue-500" />
        {isLoading ? (
          <span className="text-gray-400">Loading...</span>
        ) : error ? (
          <span className="text-red-400">Error</span>
        ) : (
          <>
            <span className="text-gray-300">
              {feeEstimate ? formatGasPrice(feeEstimate.gasPrice) : '--'}
            </span>
            {creationCost?.estimatedCostUsd && (
              <span className="text-green-400">
                (~{creationCost.estimatedCostUsd} to create)
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-700 bg-gray-800/50 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Fuel className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-white">Base Gas Fees</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Refresh gas prices"
        >
          <RefreshCw className={`h-4 w-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 mb-3">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Failed to fetch gas prices</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !feeEstimate && (
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-700 rounded w-3/4" />
        </div>
      )}

      {/* Gas Price Display */}
      {feeEstimate && (
        <div className="space-y-4">
          {/* Current Gas Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {formatGasPrice(feeEstimate.gasPrice)}
            </span>
            <span className="text-sm text-gray-400">gas price</span>
          </div>

          {/* Fee Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-700/30 rounded-lg p-2">
              <span className="text-gray-400 block text-xs">Base Fee</span>
              <span className="text-white">{feeEstimate.baseFeeGwei} Gwei</span>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-2">
              <span className="text-gray-400 block text-xs">Priority Fee</span>
              <span className="text-white">{feeEstimate.priorityFeeGwei} Gwei</span>
            </div>
          </div>

          {/* Token Creation Estimate */}
          {showCreationEstimate && creationCost && (
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Token Creation Cost Estimate
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-blue-400">
                  {parseFloat(creationCost.estimatedCostEth).toFixed(6)} ETH
                </span>
                {creationCost.estimatedCostUsd && (
                  <span className="text-sm text-gray-400">
                    ({creationCost.estimatedCostUsd})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* L2 Savings */}
          {savings && savings.savingsPercent > 0 && (
            <div className="flex items-center gap-2 text-green-400 bg-green-900/20 rounded-lg p-3">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">
                <strong>{savings.savingsPercent.toFixed(0)}% cheaper</strong> than Ethereum L1
              </span>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-xs text-gray-500 text-right">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default GasFeeDisplay;
