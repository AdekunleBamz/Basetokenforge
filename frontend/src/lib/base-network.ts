/**
 * Base Network Utilities
 * 
 * Utility functions for Base chain operations including
 * address validation, URL generation, and chain detection.
 */

import type { Address } from 'viem';

// Base Network Constants
export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// RPC URLs
export const BASE_RPC_URLS = {
  mainnet: 'https://mainnet.base.org',
  sepolia: 'https://sepolia.base.org',
} as const;

// Block Explorer URLs
export const BASE_EXPLORER_URLS = {
  mainnet: 'https://basescan.org',
  sepolia: 'https://sepolia.basescan.org',
} as const;

/**
 * Get the appropriate explorer URL for a chain ID
 */
export function getExplorerUrl(chainId: number): string {
  switch (chainId) {
    case BASE_MAINNET_CHAIN_ID:
      return BASE_EXPLORER_URLS.mainnet;
    case BASE_SEPOLIA_CHAIN_ID:
      return BASE_EXPLORER_URLS.sepolia;
    default:
      return BASE_EXPLORER_URLS.mainnet;
  }
}

/**
 * Get the transaction URL for Basescan
 */
export function getTransactionUrl(txHash: string, chainId: number = BASE_MAINNET_CHAIN_ID): string {
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get the address URL for Basescan
 */
export function getAddressUrl(address: string, chainId: number = BASE_MAINNET_CHAIN_ID): string {
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/address/${address}`;
}

/**
 * Get the token URL for Basescan
 */
export function getTokenUrl(tokenAddress: string, chainId: number = BASE_MAINNET_CHAIN_ID): string {
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/token/${tokenAddress}`;
}

/**
 * Get the block URL for Basescan
 */
export function getBlockUrl(blockNumber: number | bigint, chainId: number = BASE_MAINNET_CHAIN_ID): string {
  const baseUrl = getExplorerUrl(chainId);
  return `${baseUrl}/block/${blockNumber}`;
}

/**
 * Check if a chain ID is a Base network
 */
export function isBaseNetwork(chainId: number): boolean {
  return chainId === BASE_MAINNET_CHAIN_ID || chainId === BASE_SEPOLIA_CHAIN_ID;
}

/**
 * Check if a chain ID is Base mainnet
 */
export function isBaseMainnet(chainId: number): boolean {
  return chainId === BASE_MAINNET_CHAIN_ID;
}

/**
 * Check if a chain ID is Base Sepolia (testnet)
 */
export function isBaseSepolia(chainId: number): boolean {
  return chainId === BASE_SEPOLIA_CHAIN_ID;
}

/**
 * Get the network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case BASE_MAINNET_CHAIN_ID:
      return 'Base';
    case BASE_SEPOLIA_CHAIN_ID:
      return 'Base Sepolia';
    default:
      return 'Unknown Network';
  }
}

/**
 * Get the RPC URL for a chain ID
 */
export function getRpcUrl(chainId: number): string {
  switch (chainId) {
    case BASE_MAINNET_CHAIN_ID:
      return BASE_RPC_URLS.mainnet;
    case BASE_SEPOLIA_CHAIN_ID:
      return BASE_RPC_URLS.sepolia;
    default:
      return BASE_RPC_URLS.mainnet;
  }
}

/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate an Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Compare two addresses (case-insensitive)
 */
export function addressesEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Check if address is the zero address
 */
export function isZeroAddress(address: string): boolean {
  return address === '0x0000000000000000000000000000000000000000';
}

/**
 * Checksum an address
 */
export function checksumAddress(address: string): string {
  // Simple lowercase conversion - full checksum would require keccak256
  return address.toLowerCase().replace(/^0x/, '0x');
}

/**
 * Get native token symbol for chain
 */
export function getNativeTokenSymbol(chainId: number): string {
  if (isBaseNetwork(chainId)) {
    return 'ETH';
  }
  return 'ETH';
}

/**
 * Get block time for chain (average)
 */
export function getBlockTime(chainId: number): number {
  if (isBaseNetwork(chainId)) {
    return 2; // Base has ~2 second block time
  }
  return 12; // Ethereum L1 ~12 seconds
}

/**
 * Estimate confirmation time based on block confirmations
 */
export function estimateConfirmationTime(
  confirmations: number,
  chainId: number = BASE_MAINNET_CHAIN_ID
): string {
  const blockTime = getBlockTime(chainId);
  const seconds = confirmations * blockTime;

  if (seconds < 60) {
    return `~${seconds} seconds`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Base chain configuration for wagmi
 */
export const baseChainConfig = {
  id: BASE_MAINNET_CHAIN_ID,
  name: 'Base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [BASE_RPC_URLS.mainnet] },
    public: { http: [BASE_RPC_URLS.mainnet] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: BASE_EXPLORER_URLS.mainnet },
  },
} as const;

/**
 * Base Sepolia chain configuration for wagmi
 */
export const baseSepoliaChainConfig = {
  id: BASE_SEPOLIA_CHAIN_ID,
  name: 'Base Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [BASE_RPC_URLS.sepolia] },
    public: { http: [BASE_RPC_URLS.sepolia] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: BASE_EXPLORER_URLS.sepolia },
  },
  testnet: true,
} as const;
