/**
 * Fee Display Component
 * 
 * Shows token creation fee with ETH and USD values.
 */

"use client";

import { formatEther } from "viem";
import { useState, useEffect } from "react";

interface FeeDisplayProps {
  feeWei: bigint;
  className?: string;
  showUsd?: boolean;
}

export function FeeDisplay({ feeWei, className = '', showUsd = true }: FeeDisplayProps) {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ETH price (simplified - in production use a proper price feed)
  useEffect(() => {
    async function fetchPrice() {
      try {
        // Using a simple API for ETH price
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        setEthPrice(data.ethereum?.usd || null);
      } catch {
        console.error('Failed to fetch ETH price');
        setEthPrice(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (showUsd) {
      fetchPrice();
    } else {
      setIsLoading(false);
    }
  }, [showUsd]);

  const feeEth = formatEther(feeWei);
  const feeNumber = parseFloat(feeEth);
  const feeUsd = ethPrice ? (feeNumber * ethPrice).toFixed(2) : null;

  return (
    <div className={`flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-base-blue/20 to-purple-500/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-base-blue"
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
        <div>
          <p className="text-white/60 text-sm">Creation Fee</p>
          <p className="text-white font-semibold">{feeNumber.toFixed(6)} ETH</p>
        </div>
      </div>

      {showUsd && (
        <div className="text-right">
          {isLoading ? (
            <div className="w-16 h-6 bg-white/10 rounded animate-pulse" />
          ) : feeUsd ? (
            <>
              <p className="text-white/40 text-sm">≈</p>
              <p className="text-white/80 font-medium">${feeUsd}</p>
            </>
          ) : (
            <p className="text-white/40 text-sm">USD N/A</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact fee badge for inline display
 */
export function FeeBadge({ feeWei }: { feeWei: bigint }) {
  const feeEth = formatEther(feeWei);
  const feeNumber = parseFloat(feeEth);

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-base-blue/20 rounded-full text-base-blue text-xs font-medium">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {feeNumber.toFixed(6)} ETH
    </span>
  );
}

/**
 * Fee breakdown component
 */
export function FeeBreakdown({ 
  creationFee, 
  estimatedGas,
  gasPrice,
}: { 
  creationFee: bigint;
  estimatedGas: bigint;
  gasPrice: bigint;
}) {
  const gasCost = estimatedGas * gasPrice;
  const total = creationFee + gasCost;

  const formatFee = (wei: bigint) => {
    const eth = parseFloat(formatEther(wei));
    return eth.toFixed(6);
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
      <h4 className="text-sm font-medium text-white/80">Fee Breakdown</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Creation Fee</span>
          <span className="text-white">{formatFee(creationFee)} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Estimated Gas</span>
          <span className="text-white">{formatFee(gasCost)} ETH</span>
        </div>
        <div className="border-t border-white/10 pt-2 flex justify-between font-medium">
          <span className="text-white/80">Total</span>
          <span className="text-base-blue">{formatFee(total)} ETH</span>
        </div>
      </div>

      <p className="text-xs text-white/40">
        Gas costs on Base are typically 10-100x lower than Ethereum mainnet.
      </p>
    </div>
  );
}
