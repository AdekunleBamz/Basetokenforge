/**
 * Token Metadata Utilities
 * 
 * Functions for handling ERC20 token metadata including
 * name, symbol, decimals, and supply information.
 */

import { formatUnits, parseUnits, type Address } from 'viem';

// Token metadata interface
export interface TokenMetadata {
  /** Token contract address */
  address: Address;
  /** Token name */
  name: string;
  /** Token symbol */
  symbol: string;
  /** Token decimals */
  decimals: number;
  /** Total supply in wei */
  totalSupply: bigint;
  /** Chain ID */
  chainId: number;
}

// Display-friendly token info
export interface TokenDisplayInfo {
  /** Formatted total supply */
  formattedSupply: string;
  /** Abbreviated supply for UI */
  abbreviatedSupply: string;
  /** Supply with symbol */
  supplyWithSymbol: string;
  /** Display name with symbol */
  nameWithSymbol: string;
  /** Short address */
  shortAddress: string;
}

/**
 * Generate display info from token metadata
 */
export function getTokenDisplayInfo(metadata: TokenMetadata): TokenDisplayInfo {
  const formattedSupply = formatUnits(metadata.totalSupply, metadata.decimals);
  const numericSupply = parseFloat(formattedSupply);
  
  return {
    formattedSupply,
    abbreviatedSupply: abbreviateNumber(numericSupply),
    supplyWithSymbol: `${abbreviateNumber(numericSupply)} ${metadata.symbol}`,
    nameWithSymbol: `${metadata.name} (${metadata.symbol})`,
    shortAddress: shortenAddress(metadata.address),
  };
}

/**
 * Abbreviate large numbers
 */
export function abbreviateNumber(num: number): string {
  if (num === 0) return '0';
  
  if (num < 0.001) return '< 0.001';
  
  if (num < 1) return num.toFixed(4);
  
  if (num < 1000) return num.toFixed(2);
  
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  
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
 * Shorten an address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate token symbol format
 */
export function isValidSymbol(symbol: string): boolean {
  if (!symbol || symbol.length === 0) return false;
  if (symbol.length > 11) return false;
  return /^[A-Z0-9]+$/.test(symbol.toUpperCase());
}

/**
 * Validate token name format
 */
export function isValidName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  if (name.length > 64) return false;
  return /^[a-zA-Z0-9\s\-_.,'&!]+$/.test(name);
}

/**
 * Format token amount for input fields
 */
export function formatTokenInput(value: string, decimals: number): string {
  // Remove non-numeric characters except decimal point
  let cleaned = value.replace(/[^0-9.]/g, '');
  
  // Only allow one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit decimal places
  if (parts.length === 2 && parts[1].length > decimals) {
    cleaned = parts[0] + '.' + parts[1].slice(0, decimals);
  }
  
  return cleaned;
}

/**
 * Parse token amount from user input
 */
export function parseTokenAmount(input: string, decimals: number): bigint {
  if (!input || input === '') return 0n;
  
  const cleaned = input.replace(/,/g, '');
  const num = parseFloat(cleaned);
  
  if (isNaN(num) || num < 0) return 0n;
  
  try {
    return parseUnits(cleaned, decimals);
  } catch {
    return 0n;
  }
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  options: {
    abbreviate?: boolean;
    maxDecimals?: number;
    includeSymbol?: string;
  } = {}
): string {
  const { abbreviate = true, maxDecimals = 4, includeSymbol } = options;
  
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  
  let display: string;
  
  if (abbreviate) {
    display = abbreviateNumber(num);
  } else {
    if (num === 0) {
      display = '0';
    } else if (num < Math.pow(10, -maxDecimals)) {
      display = `< ${Math.pow(10, -maxDecimals)}`;
    } else {
      display = num.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
    }
  }
  
  if (includeSymbol) {
    display = `${display} ${includeSymbol}`;
  }
  
  return display;
}

/**
 * Calculate percentage of total supply
 */
export function calculatePercentage(amount: bigint, totalSupply: bigint): number {
  if (totalSupply === 0n) return 0;
  return Number((amount * 10000n) / totalSupply) / 100;
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
  if (percentage === 0) return '0%';
  if (percentage < 0.01) return '< 0.01%';
  if (percentage > 99.99 && percentage < 100) return '> 99.99%';
  return `${percentage.toFixed(2)}%`;
}

/**
 * Common decimal presets
 */
export const DECIMAL_PRESETS = [
  { label: '18 (Standard)', value: 18 },
  { label: '8 (Like BTC)', value: 8 },
  { label: '6 (Like USDC)', value: 6 },
  { label: '0 (No decimals)', value: 0 },
] as const;

/**
 * Common supply presets
 */
export const SUPPLY_PRESETS = [
  { label: '1 Million', value: '1000000' },
  { label: '10 Million', value: '10000000' },
  { label: '100 Million', value: '100000000' },
  { label: '1 Billion', value: '1000000000' },
  { label: '10 Billion', value: '10000000000' },
] as const;

/**
 * Check if token metadata is complete
 */
export function isMetadataComplete(metadata: Partial<TokenMetadata>): metadata is TokenMetadata {
  return !!(
    metadata.address &&
    metadata.name &&
    metadata.symbol &&
    typeof metadata.decimals === 'number' &&
    typeof metadata.totalSupply === 'bigint' &&
    typeof metadata.chainId === 'number'
  );
}
