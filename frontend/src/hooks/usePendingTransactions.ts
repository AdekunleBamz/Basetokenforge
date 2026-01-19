/**
 * usePendingTransactions Hook
 * 
 * Tracks pending transactions on Base for the connected wallet.
 * Provides real-time status updates and notifications.
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { type Address, type Hash } from 'viem';

interface PendingTransaction {
  hash: Hash;
  type: TransactionType;
  description: string;
  createdAt: number;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: bigint;
  gasUsed?: bigint;
  error?: string;
}

type TransactionType = 
  | 'token-creation'
  | 'transfer'
  | 'approval'
  | 'bridge'
  | 'swap'
  | 'other';

interface UsePendingTransactionsReturn {
  transactions: PendingTransaction[];
  pendingCount: number;
  addTransaction: (tx: Omit<PendingTransaction, 'status' | 'confirmations' | 'createdAt'>) => void;
  removeTransaction: (hash: Hash) => void;
  clearCompleted: () => void;
  getTransaction: (hash: Hash) => PendingTransaction | undefined;
}

const STORAGE_KEY = 'base-token-forge-pending-txs';
const MAX_TRANSACTIONS = 20;

export function usePendingTransactions(): UsePendingTransactionsReturn {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!address) return;

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${address}`);
      if (stored) {
        const parsed = JSON.parse(stored) as PendingTransaction[];
        setTransactions(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, [address]);

  // Save to localStorage on change
  useEffect(() => {
    if (!address) return;

    try {
      localStorage.setItem(
        `${STORAGE_KEY}-${address}`,
        JSON.stringify(transactions)
      );
    } catch {
      // Ignore storage errors
    }
  }, [transactions, address]);

  // Watch for transaction confirmations
  useEffect(() => {
    if (!publicClient) return;

    const pendingTxs = transactions.filter(tx => tx.status === 'pending');
    if (pendingTxs.length === 0) return;

    const checkTransactions = async () => {
      for (const tx of pendingTxs) {
        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: tx.hash,
          });

          if (receipt) {
            const currentBlock = await publicClient.getBlockNumber();
            const confirmations = Number(currentBlock - receipt.blockNumber);

            setTransactions(prev => prev.map(t => {
              if (t.hash !== tx.hash) return t;
              
              return {
                ...t,
                status: receipt.status === 'success' ? 'confirmed' : 'failed',
                confirmations,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed,
                error: receipt.status === 'reverted' ? 'Transaction reverted' : undefined,
              };
            }));
          }
        } catch (err) {
          // Transaction not found yet, keep as pending
          console.debug(`Transaction ${tx.hash} not yet mined`);
        }
      }
    };

    // Check immediately and then poll
    checkTransactions();
    const intervalId = setInterval(checkTransactions, 2000);

    return () => clearInterval(intervalId);
  }, [transactions, publicClient]);

  const addTransaction = useCallback((
    tx: Omit<PendingTransaction, 'status' | 'confirmations' | 'createdAt'>
  ) => {
    const newTx: PendingTransaction = {
      ...tx,
      status: 'pending',
      confirmations: 0,
      createdAt: Date.now(),
    };

    setTransactions(prev => {
      // Remove oldest if at max
      const updated = [newTx, ...prev];
      return updated.slice(0, MAX_TRANSACTIONS);
    });
  }, []);

  const removeTransaction = useCallback((hash: Hash) => {
    setTransactions(prev => prev.filter(tx => tx.hash !== hash));
  }, []);

  const clearCompleted = useCallback(() => {
    setTransactions(prev => prev.filter(tx => tx.status === 'pending'));
  }, []);

  const getTransaction = useCallback((hash: Hash) => {
    return transactions.find(tx => tx.hash === hash);
  }, [transactions]);

  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

  return {
    transactions,
    pendingCount,
    addTransaction,
    removeTransaction,
    clearCompleted,
    getTransaction,
  };
}

/**
 * Hook for watching a specific transaction
 */
interface UseWatchTransactionOptions {
  hash?: Hash;
  onConfirmed?: (receipt: { blockNumber: bigint; gasUsed: bigint }) => void;
  onFailed?: (error: string) => void;
}

export function useWatchTransaction({
  hash,
  onConfirmed,
  onFailed,
}: UseWatchTransactionOptions) {
  const publicClient = usePublicClient();
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    if (!hash || !publicClient) return;

    let cancelled = false;

    const watchTx = async () => {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });

        if (cancelled) return;

        if (receipt.status === 'success') {
          setStatus('confirmed');
          setConfirmations(1);
          onConfirmed?.({
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed,
          });
        } else {
          setStatus('failed');
          onFailed?.('Transaction reverted');
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('failed');
        onFailed?.(err instanceof Error ? err.message : 'Transaction failed');
      }
    };

    watchTx();

    return () => {
      cancelled = true;
    };
  }, [hash, publicClient, onConfirmed, onFailed]);

  return { status, confirmations };
}

/**
 * Format transaction type for display
 */
export function formatTransactionType(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    'token-creation': 'Token Creation',
    'transfer': 'Transfer',
    'approval': 'Approval',
    'bridge': 'Bridge',
    'swap': 'Swap',
    'other': 'Transaction',
  };
  return labels[type];
}

/**
 * Get icon for transaction type
 */
export function getTransactionIcon(type: TransactionType): string {
  const icons: Record<TransactionType, string> = {
    'token-creation': '🪙',
    'transfer': '📤',
    'approval': '✅',
    'bridge': '🌉',
    'swap': '🔄',
    'other': '📋',
  };
  return icons[type];
}
