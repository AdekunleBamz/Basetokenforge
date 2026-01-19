/**
 * Wallet Types for Base Token Forge
 */

import type { Address } from 'viem';

/**
 * Wallet connection status
 */
export type WalletStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

/**
 * Wallet provider type
 */
export type WalletProvider = 
  | 'metamask'
  | 'coinbase'
  | 'walletconnect'
  | 'rainbow'
  | 'farcaster'
  | 'unknown';

/**
 * Connected wallet info
 */
export interface WalletInfo {
  address: Address;
  ensName?: string;
  provider: WalletProvider;
  chainId: number;
  isConnected: boolean;
}

/**
 * Wallet balance info
 */
export interface WalletBalance {
  eth: bigint;
  ethFormatted: string;
  usdValue?: string;
}

/**
 * Wallet connection error
 */
export interface WalletError {
  code: string;
  message: string;
  cause?: Error;
}

/**
 * Farcaster wallet context
 */
export interface FarcasterWalletContext {
  isInFrame: boolean;
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  address?: Address;
}

/**
 * Supported chains for the app
 */
export const SUPPORTED_CHAIN_IDS = [
  8453,  // Base Mainnet
  84532, // Base Sepolia
] as const;

export type SupportedChainId = typeof SUPPORTED_CHAIN_IDS[number];

/**
 * Check if chain is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId);
}
