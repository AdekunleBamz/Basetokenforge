/**
 * URL Utilities
 * 
 * URL generation and parsing helpers for Base ecosystem.
 */

import { base, baseSepolia } from "wagmi/chains";

// Basescan URLs
export const BASESCAN_MAINNET = "https://basescan.org";
export const BASESCAN_SEPOLIA = "https://sepolia.basescan.org";

/**
 * Get the appropriate Basescan URL for a chain
 */
export function getBasescanUrl(chainId: number = base.id): string {
  switch (chainId) {
    case base.id:
      return BASESCAN_MAINNET;
    case baseSepolia.id:
      return BASESCAN_SEPOLIA;
    default:
      return BASESCAN_MAINNET;
  }
}

/**
 * Generate Basescan URL for an address
 */
export function getAddressUrl(address: string, chainId?: number): string {
  return `${getBasescanUrl(chainId)}/address/${address}`;
}

/**
 * Generate Basescan URL for a transaction
 */
export function getTransactionUrl(hash: string, chainId?: number): string {
  return `${getBasescanUrl(chainId)}/tx/${hash}`;
}

/**
 * Generate Basescan URL for a token
 */
export function getTokenUrl(address: string, chainId?: number): string {
  return `${getBasescanUrl(chainId)}/token/${address}`;
}

/**
 * Generate Basescan URL for a block
 */
export function getBlockUrl(blockNumber: number, chainId?: number): string {
  return `${getBasescanUrl(chainId)}/block/${blockNumber}`;
}

// Base ecosystem URLs
export const BASE_URLS = {
  // Official Base
  base: "https://base.org",
  docs: "https://docs.base.org",
  bridge: "https://bridge.base.org",
  ecosystem: "https://base.org/ecosystem",
  status: "https://status.base.org",
  
  // Development
  github: "https://github.com/base-org",
  faucet: "https://faucet.quicknode.com/base/sepolia",
  
  // Community
  discord: "https://discord.gg/buildonbase",
  twitter: "https://twitter.com/base",
  warpcast: "https://warpcast.com/base",
  
  // DeFi
  uniswap: "https://app.uniswap.org",
  aerodrome: "https://aerodrome.finance",
  
  // Tools
  chainlist: "https://chainlist.org/chain/8453",
} as const;

/**
 * Generate share URLs
 */
export function getTwitterShareUrl(text: string, url?: string): string {
  const params = new URLSearchParams({
    text,
    ...(url && { url }),
  });
  return `https://twitter.com/intent/tweet?${params}`;
}

export function getFarcasterShareUrl(text: string): string {
  const params = new URLSearchParams({
    text,
  });
  return `https://warpcast.com/~/compose?${params}`;
}

export function getTelegramShareUrl(text: string, url?: string): string {
  const params = new URLSearchParams({
    text: url ? `${text} ${url}` : text,
  });
  return `https://t.me/share/url?${params}`;
}

/**
 * Generate token share content
 */
export function generateTokenShareContent(tokenName: string, tokenSymbol: string, tokenAddress: string, chainId?: number): {
  text: string;
  url: string;
} {
  const url = getTokenUrl(tokenAddress, chainId);
  const text = `I just created $${tokenSymbol} (${tokenName}) on Base using Base Token Forge! 🔵🔥\n\nCheck it out:`;
  
  return { text, url };
}

/**
 * Open URL in new tab
 */
export function openInNewTab(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Parse token address from URL
 */
export function parseTokenAddressFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const tokenParam = urlObj.searchParams.get('token');
    if (tokenParam && tokenParam.startsWith('0x') && tokenParam.length === 42) {
      return tokenParam;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if URL is a valid Basescan URL
 */
export function isBasescanUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('basescan.org');
  } catch {
    return false;
  }
}
