/**
 * Base Chain Transaction Types
 * 
 * Type definitions for transactions on Base L2.
 */

import type { Address, Hash } from 'viem';

/**
 * Transaction status
 */
export type TransactionStatus = 
  | 'pending'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'cancelled';

/**
 * Transaction type for Base Token Forge
 */
export type ForgeTransactionType = 
  | 'token_creation'
  | 'token_transfer'
  | 'token_approve'
  | 'token_burn'
  | 'fee_payment';

/**
 * Base transaction info
 */
export interface BaseTransaction {
  hash: Hash;
  from: Address;
  to: Address | null;
  value: bigint;
  data: `0x${string}`;
  nonce: number;
  gasLimit: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

/**
 * Transaction receipt
 */
export interface TransactionReceipt {
  transactionHash: Hash;
  blockNumber: number;
  blockHash: Hash;
  status: 'success' | 'reverted';
  gasUsed: bigint;
  effectiveGasPrice: bigint;
  contractAddress?: Address;
  logs: TransactionLog[];
}

/**
 * Transaction log
 */
export interface TransactionLog {
  address: Address;
  topics: Hash[];
  data: `0x${string}`;
  blockNumber: number;
  transactionHash: Hash;
  logIndex: number;
}

/**
 * Pending transaction for UI display
 */
export interface PendingTransaction {
  hash: Hash;
  type: ForgeTransactionType;
  description: string;
  status: TransactionStatus;
  submittedAt: Date;
  confirmedAt?: Date;
  error?: string;
}

/**
 * Transaction history item
 */
export interface TransactionHistoryItem {
  hash: Hash;
  type: ForgeTransactionType;
  status: TransactionStatus;
  from: Address;
  to: Address | null;
  value: bigint;
  gasUsed: bigint;
  timestamp: Date;
  tokenAddress?: Address;
  tokenSymbol?: string;
}

/**
 * Gas estimation result
 */
export interface GasEstimation {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  estimatedCost: bigint;
  estimatedCostEth: string;
}

/**
 * Transaction confirmation options
 */
export interface TransactionConfirmOptions {
  confirmations?: number;
  timeout?: number;
  pollingInterval?: number;
}

/**
 * L1 data fee info (Base-specific)
 */
export interface L1DataFee {
  l1GasUsed: bigint;
  l1GasPrice: bigint;
  l1Fee: bigint;
  l1FeeScalar: number;
}

/**
 * Complete transaction cost breakdown for Base
 */
export interface BaseTxCostBreakdown {
  l2ExecutionFee: bigint;
  l1DataFee: bigint;
  totalFee: bigint;
  totalFeeEth: string;
}
