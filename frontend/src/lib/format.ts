/**
 * Formatting Utilities
 * 
 * Helper functions for formatting numbers, addresses, and values
 * specific to Base Token Forge needs.
 */

import { formatUnits, parseUnits } from 'viem';

/**
 * Format a token amount with specified decimals
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  });
}

/**
 * Format ETH value with appropriate precision
 */
export function formatEth(
  wei: bigint,
  displayDecimals: number = 6
): string {
  const eth = formatUnits(wei, 18);
  const num = parseFloat(eth);
  
  if (num === 0) return '0 ETH';
  if (num < 0.000001) return '< 0.000001 ETH';
  
  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  })} ETH`;
}

/**
 * Format USD value
 */
export function formatUsd(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.01) return '< $0.01';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format large numbers with abbreviations
 */
export function formatCompactNumber(num: number): string {
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string, chars: number = 6): string {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format gas price in gwei
 */
export function formatGwei(wei: bigint): string {
  const gwei = formatUnits(wei, 9);
  const num = parseFloat(gwei);
  
  if (num < 0.001) return '< 0.001 gwei';
  
  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })} gwei`;
}

/**
 * Format block number
 */
export function formatBlockNumber(blockNumber: bigint | number): string {
  return Number(blockNumber).toLocaleString();
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date | number): string {
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const seconds = Math.floor((now - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format token supply (with proper decimal handling)
 */
export function formatSupply(
  supply: bigint,
  decimals: number = 18
): string {
  const formatted = formatUnits(supply, decimals);
  const num = parseFloat(formatted);
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  
  return num.toLocaleString();
}

/**
 * Parse user input to token amount (bigint)
 */
export function parseTokenInput(
  input: string,
  decimals: number = 18
): bigint | null {
  try {
    // Remove commas and spaces
    const cleaned = input.replace(/[,\s]/g, '');
    if (!cleaned || isNaN(Number(cleaned))) return null;
    return parseUnits(cleaned, decimals);
  } catch {
    return null;
  }
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Format L2 savings (compared to L1)
 */
export function formatL2Savings(l1Cost: bigint, l2Cost: bigint): string {
  if (l1Cost === 0n) return '0%';
  
  const savings = ((l1Cost - l2Cost) * 100n) / l1Cost;
  return `${savings.toString()}% cheaper`;
}
