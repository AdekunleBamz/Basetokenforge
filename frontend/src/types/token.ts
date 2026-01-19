/**
 * Base Chain Token Types
 * 
 * Type definitions for tokens deployed on Base chain via Token Forge.
 */

import type { Address } from 'viem';

/**
 * Token metadata stored on-chain
 */
export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

/**
 * Token information including deployment details
 */
export interface TokenInfo extends TokenMetadata {
  address: Address;
  owner: Address;
  creator: Address;
  createdAt: number; // Unix timestamp
  blockNumber: number;
  transactionHash: string;
}

/**
 * Token balance for a specific holder
 */
export interface TokenBalance {
  tokenAddress: Address;
  holderAddress: Address;
  balance: bigint;
  formattedBalance: string;
}

/**
 * Token transfer event
 */
export interface TokenTransfer {
  tokenAddress: Address;
  from: Address;
  to: Address;
  amount: bigint;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

/**
 * Token creation form data
 */
export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

/**
 * Token creation transaction result
 */
export interface TokenCreationResult {
  tokenAddress: Address;
  transactionHash: string;
  blockNumber: number;
  gasUsed: bigint;
  creator: Address;
}

/**
 * Token creation status
 */
export type TokenCreationStatus = 
  | 'idle'
  | 'validating'
  | 'confirming'
  | 'pending'
  | 'success'
  | 'error';

/**
 * Token creation error
 */
export interface TokenCreationError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Token list item for display
 */
export interface TokenListItem {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  formattedSupply: string;
  createdAt: Date;
  isOwner: boolean;
}

/**
 * Factory contract info
 */
export interface FactoryInfo {
  address: Address;
  owner: Address;
  creationFee: bigint;
  feeRecipient: Address;
  totalTokensCreated: number;
}

/**
 * Token search filters
 */
export interface TokenSearchFilters {
  query?: string;
  creator?: Address;
  minSupply?: bigint;
  maxSupply?: bigint;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Paginated token list
 */
export interface PaginatedTokenList {
  tokens: TokenListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Base chain token standard
 */
export type BaseTokenStandard = 'ERC20' | 'ERC721' | 'ERC1155';

/**
 * Token verification status on Basescan
 */
export interface TokenVerificationStatus {
  isVerified: boolean;
  sourceCodeUrl?: string;
  verifiedAt?: Date;
}
