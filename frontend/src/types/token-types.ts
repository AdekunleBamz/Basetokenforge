/**
 * Base Token Forge Type Definitions
 * 
 * Core TypeScript types for the Base Token Forge application.
 * These types ensure type safety across the entire codebase.
 */

import type { Address, Hash } from 'viem';

// ============================================
// Network Types
// ============================================

/** Supported chain IDs */
export type SupportedChainId = 8453 | 84532;

/** Network configuration */
export interface NetworkConfig {
  chainId: SupportedChainId;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: string;
    public: string;
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  contracts?: {
    tokenFactory?: Address;
  };
}

// ============================================
// Token Types
// ============================================

/** Basic token information */
export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  chainId: number;
}

/** Extended token metadata */
export interface TokenMetadata extends TokenInfo {
  owner?: Address;
  logo?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  createdAt?: Date;
  creationTxHash?: Hash;
  verified?: boolean;
}

/** Token balance for a holder */
export interface TokenBalance {
  token: TokenInfo;
  balance: bigint;
  formattedBalance: string;
}

/** Token holder information */
export interface TokenHolder {
  address: Address;
  balance: bigint;
  percentage: number;
  isContract?: boolean;
}

/** Token transfer record */
export interface TokenTransfer {
  txHash: Hash;
  from: Address;
  to: Address;
  amount: bigint;
  timestamp: Date;
  blockNumber: bigint;
}

/** Token approval record */
export interface TokenApproval {
  owner: Address;
  spender: Address;
  allowance: bigint;
  txHash?: Hash;
  timestamp?: Date;
}

// ============================================
// Token Creation Types
// ============================================

/** Token creation form data */
export interface TokenFormData {
  name: string;
  symbol: string;
  initialSupply: string;
  decimals: number;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}

/** Token creation step */
export type CreationStep = 
  | 'configure'
  | 'preview'
  | 'confirm'
  | 'deploying'
  | 'success'
  | 'error';

/** Token creation state */
export interface TokenCreationState {
  step: CreationStep;
  formData: Partial<TokenFormData>;
  txHash?: Hash;
  tokenAddress?: Address;
  error?: string;
}

/** Token creation result */
export interface TokenCreationResult {
  success: boolean;
  tokenAddress?: Address;
  txHash?: Hash;
  error?: string;
}

// ============================================
// Transaction Types
// ============================================

/** Transaction status */
export type TransactionStatus = 
  | 'idle'
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'cancelled';

/** Transaction record */
export interface TransactionRecord {
  hash: Hash;
  type: 'creation' | 'transfer' | 'approval' | 'revoke';
  status: TransactionStatus;
  from: Address;
  to?: Address;
  value?: bigint;
  tokenAddress?: Address;
  tokenSymbol?: string;
  timestamp: Date;
  blockNumber?: bigint;
  gasUsed?: bigint;
  error?: string;
}

/** Gas estimation result */
export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  estimatedCost: bigint;
  estimatedCostUsd?: number;
}

// ============================================
// Wallet Types
// ============================================

/** Connected wallet state */
export interface WalletState {
  isConnected: boolean;
  address?: Address;
  chainId?: number;
  isCorrectNetwork: boolean;
}

/** Wallet balance */
export interface WalletBalance {
  eth: bigint;
  formattedEth: string;
  tokens: TokenBalance[];
}

// ============================================
// UI Types
// ============================================

/** Toast notification */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Modal state */
export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: unknown;
}

/** Pagination state */
export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Sort configuration */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/** Filter configuration */
export interface FilterConfig {
  search?: string;
  chainId?: number;
  verified?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

// ============================================
// API Types
// ============================================

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

/** Basescan API response */
export interface BasescanApiResponse<T> {
  status: '0' | '1';
  message: string;
  result: T;
}

// ============================================
// Event Types
// ============================================

/** Token creation event */
export interface TokenCreatedEvent {
  creator: Address;
  tokenAddress: Address;
  name: string;
  symbol: string;
  totalSupply: bigint;
  blockNumber: bigint;
  txHash: Hash;
}

/** Transfer event */
export interface TransferEvent {
  from: Address;
  to: Address;
  value: bigint;
  blockNumber: bigint;
  txHash: Hash;
}

/** Approval event */
export interface ApprovalEvent {
  owner: Address;
  spender: Address;
  value: bigint;
  blockNumber: bigint;
  txHash: Hash;
}

// ============================================
// Storage Types
// ============================================

/** Local storage token record */
export interface StoredToken {
  address: Address;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  addedAt: number;
  favorite?: boolean;
  hidden?: boolean;
}

/** User preferences */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultChainId: SupportedChainId;
  showTestnet: boolean;
  gasPreset: 'low' | 'medium' | 'high';
  expertMode: boolean;
  notifications: {
    transactions: boolean;
    transfers: boolean;
    approvals: boolean;
  };
}

// ============================================
// Utility Types
// ============================================

/** Make all properties optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Make specific properties required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Extract non-nullable type */
export type NonNullable<T> = Exclude<T, null | undefined>;

export default {};
