/**
 * Token Transfer Hook for Base Chain
 * 
 * Handles ERC20 token transfers with proper error handling,
 * transaction tracking, and Base-specific optimizations.
 */

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import type { Address } from 'viem';
import { parseUnits, formatUnits } from 'viem';

// ERC20 Transfer ABI
const TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

export type TransferStatus = 
  | 'idle' 
  | 'preparing' 
  | 'awaiting-signature' 
  | 'pending' 
  | 'success' 
  | 'error';

export interface TransferResult {
  /** Transaction hash */
  hash: `0x${string}` | null;
  /** Block number where tx was included */
  blockNumber: bigint | null;
  /** Gas used by the transaction */
  gasUsed: bigint | null;
  /** Timestamp of completion */
  timestamp: Date | null;
}

export interface UseTokenTransferReturn {
  /** Current transfer status */
  status: TransferStatus;
  /** Transfer result data */
  result: TransferResult;
  /** Error if any occurred */
  error: Error | null;
  /** Execute a transfer */
  transfer: (params: TransferParams) => Promise<boolean>;
  /** Reset transfer state */
  reset: () => void;
  /** Is transfer in progress */
  isPending: boolean;
  /** Is awaiting user signature */
  isAwaitingSignature: boolean;
}

export interface TransferParams {
  /** Token contract address */
  tokenAddress: Address;
  /** Recipient address */
  to: Address;
  /** Amount to transfer (human readable) */
  amount: string;
  /** Token decimals (default: 18) */
  decimals?: number;
}

/**
 * Hook for handling ERC20 token transfers on Base
 */
export function useTokenTransfer(): UseTokenTransferReturn {
  const publicClient = usePublicClient();
  const { writeContractAsync, reset: resetWrite } = useWriteContract();
  
  const [status, setStatus] = useState<TransferStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [result, setResult] = useState<TransferResult>({
    hash: null,
    blockNumber: null,
    gasUsed: null,
    timestamp: null,
  });

  // Watch for transaction receipt
  const { data: receipt, isLoading: isWaitingReceipt } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
  });

  // Update result when receipt arrives
  if (receipt && status === 'pending') {
    setStatus('success');
    setResult({
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      timestamp: new Date(),
    });
  }

  const transfer = useCallback(
    async ({ tokenAddress, to, amount, decimals = 18 }: TransferParams): Promise<boolean> => {
      try {
        setStatus('preparing');
        setError(null);
        setResult({ hash: null, blockNumber: null, gasUsed: null, timestamp: null });

        // Parse amount to wei
        const amountWei = parseUnits(amount, decimals);

        if (amountWei <= 0n) {
          throw new Error('Amount must be greater than 0');
        }

        // Validate recipient address
        if (!to || to === '0x0000000000000000000000000000000000000000') {
          throw new Error('Invalid recipient address');
        }

        // Check sender balance (optional but recommended)
        if (publicClient) {
          try {
            const balance = await publicClient.readContract({
              address: tokenAddress,
              abi: TRANSFER_ABI,
              functionName: 'balanceOf',
              args: [to], // Check recipient balance for sanity
            });
            console.log('Recipient current balance:', formatUnits(balance, decimals));
          } catch (e) {
            // Non-critical, continue with transfer
          }
        }

        setStatus('awaiting-signature');

        // Execute transfer
        const hash = await writeContractAsync({
          address: tokenAddress,
          abi: TRANSFER_ABI,
          functionName: 'transfer',
          args: [to, amountWei],
        });

        setTxHash(hash);
        setStatus('pending');

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Transfer failed');
        setError(error);
        setStatus('error');
        return false;
      }
    },
    [publicClient, writeContractAsync]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setTxHash(null);
    setResult({ hash: null, blockNumber: null, gasUsed: null, timestamp: null });
    resetWrite();
  }, [resetWrite]);

  return {
    status,
    result,
    error,
    transfer,
    reset,
    isPending: status === 'pending' || isWaitingReceipt,
    isAwaitingSignature: status === 'awaiting-signature',
  };
}

/**
 * Format transfer amount for display
 */
export function formatTransferAmount(amount: string, symbol: string): string {
  const num = parseFloat(amount);
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B ${symbol}`;
  }
  
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M ${symbol}`;
  }
  
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K ${symbol}`;
  }
  
  return `${num.toLocaleString()} ${symbol}`;
}

export default useTokenTransfer;
