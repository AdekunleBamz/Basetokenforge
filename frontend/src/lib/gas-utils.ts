/**
 * Base Chain Gas Utilities
 * 
 * Utilities for estimating and managing gas on Base L2.
 * Base offers significantly lower gas fees compared to Ethereum mainnet.
 */

import { formatEther, parseGwei } from 'viem';

// Base L2 Gas Constants
export const BASE_GAS_CONSTANTS = {
  // Minimum gas price on Base (in gwei)
  MIN_GAS_PRICE: 0.001,
  
  // Maximum priority fee we're willing to pay (in gwei)
  MAX_PRIORITY_FEE: 0.1,
  
  // L1 data fee estimation multiplier
  L1_DATA_FEE_MULTIPLIER: 1.25,
  
  // Gas limits for common operations
  GAS_LIMITS: {
    TRANSFER: 21000n,
    ERC20_TRANSFER: 65000n,
    ERC20_APPROVE: 46000n,
    TOKEN_DEPLOY: 1500000n,
    TOKEN_CREATION: 2000000n,
    FACTORY_CALL: 2500000n,
  },
} as const;

/**
 * Estimate gas cost in ETH for a given gas amount
 */
export function estimateGasCost(gasAmount: bigint, gasPriceGwei = 0.001): string {
  const gasPriceWei = parseGwei(gasPriceGwei.toString());
  const costWei = gasAmount * gasPriceWei;
  return formatEther(costWei);
}

/**
 * Estimate token deployment gas cost
 */
export function estimateTokenDeploymentCost(gasPriceGwei = 0.001): {
  gasLimit: bigint;
  estimatedCost: string;
  estimatedCostUsd: string;
} {
  const gasLimit = BASE_GAS_CONSTANTS.GAS_LIMITS.TOKEN_CREATION;
  const estimatedCost = estimateGasCost(gasLimit, gasPriceGwei);
  
  // Rough ETH price estimation for display (would typically fetch live)
  const ethPriceUsd = 2500;
  const costInUsd = parseFloat(estimatedCost) * ethPriceUsd;
  
  return {
    gasLimit,
    estimatedCost,
    estimatedCostUsd: costInUsd.toFixed(4),
  };
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gasPriceWei: bigint): string {
  const gwei = Number(gasPriceWei) / 1e9;
  
  if (gwei < 0.01) {
    return `${(gwei * 1000).toFixed(4)} Mwei`;
  }
  
  return `${gwei.toFixed(4)} Gwei`;
}

/**
 * Calculate L1 data fee (Base-specific)
 * Base charges for data posted to L1 Ethereum
 */
export function estimateL1DataFee(dataBytes: number, l1GasPriceGwei = 30): string {
  // Approximate L1 data fee calculation
  // Each byte of calldata costs approximately 16 gas on L1
  const l1GasUsed = dataBytes * 16;
  const l1GasPriceWei = parseGwei(l1GasPriceGwei.toString());
  const l1Fee = BigInt(l1GasUsed) * l1GasPriceWei;
  
  return formatEther(l1Fee);
}

/**
 * Get gas savings compared to Ethereum mainnet
 */
export function calculateGasSavings(
  baseGasCost: string,
  mainnetGasCostEstimate: string
): {
  savingsEth: string;
  savingsPercent: number;
} {
  const baseCost = parseFloat(baseGasCost);
  const mainnetCost = parseFloat(mainnetGasCostEstimate);
  
  const savings = mainnetCost - baseCost;
  const savingsPercent = (savings / mainnetCost) * 100;
  
  return {
    savingsEth: savings.toFixed(6),
    savingsPercent: Math.round(savingsPercent),
  };
}

/**
 * Check if gas price is reasonable for Base
 */
export function isGasPriceReasonable(gasPriceGwei: number): boolean {
  // Base gas should be very low, anything above 1 gwei is suspicious
  return gasPriceGwei < 1;
}

/**
 * Get recommended gas settings for Base
 */
export function getRecommendedGasSettings(): {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
} {
  return {
    maxFeePerGas: parseGwei('0.01'),
    maxPriorityFeePerGas: parseGwei('0.001'),
  };
}
