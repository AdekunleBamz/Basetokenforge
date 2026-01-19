/**
 * Share Utilities
 * 
 * Social sharing and URL generation for tokens.
 */

import { base, baseSepolia } from "wagmi/chains";

interface ShareableToken {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
}

/**
 * Generate Basescan URL for token
 */
export function getBasescanUrl(address: string, chainId: number): string {
  const baseUrl = chainId === baseSepolia.id 
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';
  return `${baseUrl}/token/${address}`;
}

/**
 * Generate shareable token URL
 */
export function getShareUrl(token: ShareableToken): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://basetokenforge.xyz';
  return `${baseUrl}/token/${token.address}`;
}

/**
 * Generate Twitter/X share text
 */
export function getTwitterShareText(token: ShareableToken): string {
  return `I just created $${token.symbol} (${token.name}) on @base using Base Token Forge! 🔵🔥

Check it out: ${getBasescanUrl(token.address, token.chainId)}

#Base #ERC20 #Web3 #OnchainSummer`;
}

/**
 * Generate Twitter share URL
 */
export function getTwitterShareUrl(token: ShareableToken): string {
  const text = encodeURIComponent(getTwitterShareText(token));
  return `https://twitter.com/intent/tweet?text=${text}`;
}

/**
 * Generate Warpcast (Farcaster) share text
 */
export function getWarpcastShareText(token: ShareableToken): string {
  return `I just created $${token.symbol} (${token.name}) on Base using Base Token Forge! 🔵🔥

${getBasescanUrl(token.address, token.chainId)}`;
}

/**
 * Generate Warpcast share URL
 */
export function getWarpcastShareUrl(token: ShareableToken): string {
  const text = encodeURIComponent(getWarpcastShareText(token));
  return `https://warpcast.com/~/compose?text=${text}`;
}

/**
 * Generate Telegram share URL
 */
export function getTelegramShareUrl(token: ShareableToken): string {
  const text = encodeURIComponent(
    `New token on Base: ${token.name} ($${token.symbol})\n\n${getBasescanUrl(token.address, token.chainId)}`
  );
  return `https://t.me/share/url?url=${encodeURIComponent(getShareUrl(token))}&text=${text}`;
}

/**
 * Copy token address to clipboard
 */
export async function copyTokenAddress(address: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share platforms config
 */
export const SHARE_PLATFORMS = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: 'twitter',
    getUrl: getTwitterShareUrl,
    color: '#1DA1F2',
  },
  {
    id: 'warpcast',
    name: 'Warpcast',
    icon: 'farcaster',
    getUrl: getWarpcastShareUrl,
    color: '#8B5CF6',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'telegram',
    getUrl: getTelegramShareUrl,
    color: '#0088CC',
  },
] as const;

/**
 * Open share popup
 */
export function openSharePopup(url: string): void {
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  
  window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
  );
}
