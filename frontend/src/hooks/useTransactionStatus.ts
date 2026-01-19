/**
 * Transaction Status Tracker Hook
 * 
 * Tracks and persists transaction status for Base transactions.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

export type TransactionPhase = 
  | 'idle'
  | 'preparing'
  | 'awaiting-signature'
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed';

interface TransactionState {
  phase: TransactionPhase;
  hash: `0x${string}` | null;
  error: Error | null;
  confirmations: number;
  startTime: number | null;
  endTime: number | null;
}

interface UseTransactionStatusOptions {
  requiredConfirmations?: number;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (error: Error) => void;
}

export function useTransactionStatus(options: UseTransactionStatusOptions = {}) {
  const { 
    requiredConfirmations = 1, 
    onSuccess, 
    onError 
  } = options;

  const [state, setState] = useState<TransactionState>({
    phase: 'idle',
    hash: null,
    error: null,
    confirmations: 0,
    startTime: null,
    endTime: null,
  });

  // Wait for transaction receipt
  const { 
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: hasFailed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: state.hash ?? undefined,
    confirmations: requiredConfirmations,
  });

  // Update phase based on receipt status
  useEffect(() => {
    if (!state.hash) return;

    if (isConfirming) {
      setState(prev => ({ ...prev, phase: 'confirming' }));
    }

    if (isConfirmed && receipt) {
      setState(prev => ({
        ...prev,
        phase: 'confirmed',
        confirmations: requiredConfirmations,
        endTime: Date.now(),
      }));
      onSuccess?.(state.hash);
    }

    if (hasFailed && receiptError) {
      setState(prev => ({
        ...prev,
        phase: 'failed',
        error: receiptError,
        endTime: Date.now(),
      }));
      onError?.(receiptError);
    }
  }, [isConfirming, isConfirmed, hasFailed, receipt, receiptError, state.hash, requiredConfirmations, onSuccess, onError]);

  // Start tracking a transaction
  const startTracking = useCallback((hash: `0x${string}`) => {
    setState({
      phase: 'pending',
      hash,
      error: null,
      confirmations: 0,
      startTime: Date.now(),
      endTime: null,
    });
  }, []);

  // Set preparing phase
  const setPreparing = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'preparing',
      startTime: Date.now(),
    }));
  }, []);

  // Set awaiting signature phase
  const setAwaitingSignature = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'awaiting-signature',
    }));
  }, []);

  // Set error
  const setError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      phase: 'failed',
      error,
      endTime: Date.now(),
    }));
    onError?.(error);
  }, [onError]);

  // Reset to idle
  const reset = useCallback(() => {
    setState({
      phase: 'idle',
      hash: null,
      error: null,
      confirmations: 0,
      startTime: null,
      endTime: null,
    });
  }, []);

  // Calculate duration
  const duration = state.startTime && state.endTime
    ? state.endTime - state.startTime
    : state.startTime
    ? Date.now() - state.startTime
    : null;

  return {
    ...state,
    receipt,
    duration,
    isIdle: state.phase === 'idle',
    isPreparing: state.phase === 'preparing',
    isAwaitingSignature: state.phase === 'awaiting-signature',
    isPending: state.phase === 'pending',
    isConfirming: state.phase === 'confirming',
    isConfirmed: state.phase === 'confirmed',
    isFailed: state.phase === 'failed',
    isActive: ['preparing', 'awaiting-signature', 'pending', 'confirming'].includes(state.phase),
    startTracking,
    setPreparing,
    setAwaitingSignature,
    setError,
    reset,
  };
}

/**
 * Format transaction duration for display
 */
export function formatDuration(ms: number | null): string {
  if (ms === null) return '--';
  
  const seconds = Math.floor(ms / 1000);
  
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get phase display info
 */
export function getPhaseInfo(phase: TransactionPhase) {
  switch (phase) {
    case 'idle':
      return {
        label: 'Ready',
        description: 'Ready to start',
        color: 'text-white/60',
        bgColor: 'bg-white/10',
      };
    case 'preparing':
      return {
        label: 'Preparing',
        description: 'Building transaction...',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
      };
    case 'awaiting-signature':
      return {
        label: 'Sign',
        description: 'Confirm in your wallet',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
      };
    case 'pending':
      return {
        label: 'Pending',
        description: 'Waiting for Base network...',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
      };
    case 'confirming':
      return {
        label: 'Confirming',
        description: 'Awaiting confirmation...',
        color: 'text-base-blue',
        bgColor: 'bg-base-blue/20',
      };
    case 'confirmed':
      return {
        label: 'Confirmed',
        description: 'Transaction successful!',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
      };
    case 'failed':
      return {
        label: 'Failed',
        description: 'Transaction failed',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
      };
  }
}
