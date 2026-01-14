/**
 * Token-related API and helper functions
 */

import { type Address } from 'viem';

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  owner: Address;
  createdAt?: number;
}

export interface CreateTokenParams {
  name: string;
  symbol: string;
  initialSupply: string;
  decimals?: number;
}

/**
 * Validate token creation parameters
 */
export function validateTokenParams(params: CreateTokenParams): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name
  if (!params.name || params.name.trim().length === 0) {
    errors.push('Token name is required');
  } else if (params.name.length > 32) {
    errors.push('Token name must be 32 characters or less');
  }

  // Validate symbol
  if (!params.symbol || params.symbol.trim().length === 0) {
    errors.push('Token symbol is required');
  } else if (params.symbol.length > 8) {
    errors.push('Token symbol must be 8 characters or less');
  } else if (!/^[A-Za-z0-9]+$/.test(params.symbol)) {
    errors.push('Token symbol must contain only letters and numbers');
  }

  // Validate initial supply
  const supply = Number(params.initialSupply);
  if (!params.initialSupply || isNaN(supply)) {
    errors.push('Initial supply is required');
  } else if (supply <= 0) {
    errors.push('Initial supply must be greater than 0');
  } else if (supply > 1e24) {
    errors.push('Initial supply exceeds maximum allowed');
  }

  // Validate decimals
  if (params.decimals !== undefined) {
    if (params.decimals < 0 || params.decimals > 18) {
      errors.push('Decimals must be between 0 and 18');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format token supply for display
 */
export function formatTokenSupply(supply: string | bigint, decimals: number = 18): string {
  const value = typeof supply === 'string' ? BigInt(supply) : supply;
  const divisor = BigInt(10 ** decimals);
  const result = Number(value) / Number(divisor);
  
  if (result >= 1e9) {
    return `${(result / 1e9).toFixed(2)}B`;
  }
  if (result >= 1e6) {
    return `${(result / 1e6).toFixed(2)}M`;
  }
  if (result >= 1e3) {
    return `${(result / 1e3).toFixed(2)}K`;
  }
  return result.toLocaleString();
}

/**
 * Parse token supply from human readable to raw amount
 */
export function parseTokenSupply(supply: string, decimals: number = 18): bigint {
  const value = parseFloat(supply);
  if (isNaN(value)) return BigInt(0);
  return BigInt(Math.floor(value * 10 ** decimals));
}

/**
 * Generate a unique token identifier
 */
export function generateTokenId(address: Address, chainId: number): string {
  return `${chainId}:${address.toLowerCase()}`;
}

/**
 * Check if address is a valid token contract (basic check)
 */
export function isValidTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
