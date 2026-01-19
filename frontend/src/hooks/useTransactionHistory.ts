/**
 * useTransactionHistory Hook
 * 
 * Tracks transaction history for token operations on Base.
 */

"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Hash } from "viem";

export interface TransactionRecord {
  hash: Hash;
  type: 'token_creation' | 'transfer' | 'approve' | 'burn';
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  tokenAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  amount?: string;
  from?: string;
  to?: string;
}

interface UseTransactionHistoryReturn {
  transactions: TransactionRecord[];
  addTransaction: (tx: Omit<TransactionRecord, 'timestamp'>) => void;
  updateTransaction: (hash: Hash, updates: Partial<TransactionRecord>) => void;
  removeTransaction: (hash: Hash) => void;
  clearHistory: () => void;
  getPendingTransactions: () => TransactionRecord[];
  getRecentTransactions: (count: number) => TransactionRecord[];
}

const STORAGE_KEY = 'base-token-forge-tx-history';
const MAX_HISTORY_SIZE = 100;

export function useTransactionHistory(
  address: `0x${string}` | null
): UseTransactionHistoryReturn {
  const storageKey = address ? `${STORAGE_KEY}-${address}` : STORAGE_KEY;
  
  const [transactions, setTransactions] = useLocalStorage<TransactionRecord[]>(
    storageKey,
    []
  );

  const addTransaction = useCallback((tx: Omit<TransactionRecord, 'timestamp'>) => {
    const newTx: TransactionRecord = {
      ...tx,
      timestamp: Date.now(),
    };

    setTransactions(prev => {
      const updated = [newTx, ...prev];
      // Keep only the most recent transactions
      return updated.slice(0, MAX_HISTORY_SIZE);
    });
  }, [setTransactions]);

  const updateTransaction = useCallback((hash: Hash, updates: Partial<TransactionRecord>) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.hash === hash ? { ...tx, ...updates } : tx
      )
    );
  }, [setTransactions]);

  const removeTransaction = useCallback((hash: Hash) => {
    setTransactions(prev => prev.filter(tx => tx.hash !== hash));
  }, [setTransactions]);

  const clearHistory = useCallback(() => {
    setTransactions([]);
  }, [setTransactions]);

  const getPendingTransactions = useCallback(() => {
    return transactions.filter(tx => tx.status === 'pending');
  }, [transactions]);

  const getRecentTransactions = useCallback((count: number) => {
    return transactions.slice(0, count);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    clearHistory,
    getPendingTransactions,
    getRecentTransactions,
  };
}
