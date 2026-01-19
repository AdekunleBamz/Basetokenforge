/**
 * Transaction Utilities for Base Chain
 * 
 * Helper functions for handling blockchain transactions
 * with proper error handling and status tracking.
 */

import { type Hash, type TransactionReceipt } from 'viem';

// Transaction status types
export type TransactionStatus = 
  | 'idle'
  | 'preparing'
  | 'awaiting-signature'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'rejected';

// Transaction error types
export type TransactionErrorType =
  | 'user-rejected'
  | 'insufficient-funds'
  | 'gas-estimation-failed'
  | 'execution-reverted'
  | 'network-error'
  | 'timeout'
  | 'unknown';

export interface TransactionError {
  type: TransactionErrorType;
  message: string;
  details?: string;
}

/**
 * Parse transaction error to user-friendly message
 */
export function parseTransactionError(error: unknown): TransactionError {
  const errorString = error instanceof Error ? error.message : String(error);

  // User rejected
  if (
    errorString.includes('rejected') ||
    errorString.includes('denied') ||
    errorString.includes('user rejected') ||
    errorString.includes('User denied')
  ) {
    return {
      type: 'user-rejected',
      message: 'Transaction was cancelled',
      details: 'You rejected the transaction in your wallet.',
    };
  }

  // Insufficient funds
  if (
    errorString.includes('insufficient funds') ||
    errorString.includes('insufficient balance')
  ) {
    return {
      type: 'insufficient-funds',
      message: 'Insufficient funds',
      details: 'You do not have enough ETH to complete this transaction.',
    };
  }

  // Gas estimation failed
  if (
    errorString.includes('gas') ||
    errorString.includes('intrinsic gas too low')
  ) {
    return {
      type: 'gas-estimation-failed',
      message: 'Gas estimation failed',
      details: 'Unable to estimate gas for this transaction.',
    };
  }

  // Execution reverted
  if (
    errorString.includes('revert') ||
    errorString.includes('execution reverted')
  ) {
    // Try to extract revert reason
    const revertMatch = errorString.match(/reason="([^"]+)"/);
    const reason = revertMatch ? revertMatch[1] : 'Transaction would fail';
    
    return {
      type: 'execution-reverted',
      message: 'Transaction failed',
      details: reason,
    };
  }

  // Network error
  if (
    errorString.includes('network') ||
    errorString.includes('connection') ||
    errorString.includes('RPC')
  ) {
    return {
      type: 'network-error',
      message: 'Network error',
      details: 'Unable to connect to the network. Please try again.',
    };
  }

  // Timeout
  if (errorString.includes('timeout')) {
    return {
      type: 'timeout',
      message: 'Transaction timed out',
      details: 'The transaction took too long. It may still be pending.',
    };
  }

  // Unknown error
  return {
    type: 'unknown',
    message: 'Transaction failed',
    details: errorString.slice(0, 200),
  };
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: Hash, chars: number = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Check if transaction was successful from receipt
 */
export function isTransactionSuccessful(receipt: TransactionReceipt): boolean {
  return receipt.status === 'success';
}

/**
 * Calculate confirmation percentage (for UI progress)
 */
export function calculateConfirmationProgress(
  currentConfirmations: number,
  requiredConfirmations: number = 1
): number {
  if (requiredConfirmations === 0) return 100;
  return Math.min(100, (currentConfirmations / requiredConfirmations) * 100);
}

/**
 * Get human-readable transaction status message
 */
export function getStatusMessage(status: TransactionStatus): string {
  switch (status) {
    case 'idle':
      return 'Ready';
    case 'preparing':
      return 'Preparing transaction...';
    case 'awaiting-signature':
      return 'Please confirm in your wallet';
    case 'pending':
      return 'Transaction submitted';
    case 'confirming':
      return 'Waiting for confirmation...';
    case 'success':
      return 'Transaction successful!';
    case 'failed':
      return 'Transaction failed';
    case 'rejected':
      return 'Transaction cancelled';
    default:
      return 'Unknown status';
  }
}

/**
 * Estimate wait time for confirmations on Base
 */
export function estimateWaitTime(confirmations: number): string {
  // Base has ~2 second block times
  const seconds = confirmations * 2;
  
  if (seconds < 60) {
    return `~${seconds}s`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  return `~${minutes}m`;
}

/**
 * Create Basescan transaction URL
 */
export function createBasescanTxUrl(
  hash: Hash,
  isTestnet: boolean = false
): string {
  const baseUrl = isTestnet 
    ? 'https://sepolia.basescan.org' 
    : 'https://basescan.org';
  return `${baseUrl}/tx/${hash}`;
}

/**
 * Wait with timeout utility
 */
export async function waitWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Retry a transaction function with exponential backoff
 */
export async function retryTransaction<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry user rejections
      const parsed = parseTransactionError(error);
      if (parsed.type === 'user-rejected') {
        throw lastError;
      }
      
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError ?? new Error('Max retry attempts reached');
}

/**
 * Format gas used for display
 */
export function formatGasUsed(gasUsed: bigint): string {
  const num = Number(gasUsed);
  
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  
  return num.toLocaleString();
}
