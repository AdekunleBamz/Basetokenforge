'use client';

/**
 * useContractWrite Hook
 * 
 * Simplified hook for writing to contracts on Base L2
 * with built-in gas optimization and error handling.
 */

import { useState, useCallback } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import type { Address, Hash, Abi } from 'viem';

// Write state
export type WriteStatus = 'idle' | 'preparing' | 'signing' | 'pending' | 'success' | 'error';

// Write result
export interface WriteResult {
  hash?: Hash;
  blockNumber?: bigint;
  error?: Error;
}

// Hook options
interface UseContractWriteOptions {
  /** Contract address */
  address: Address;
  /** Contract ABI */
  abi: Abi;
  /** Function name to call */
  functionName: string;
  /** Callback on success */
  onSuccess?: (result: WriteResult) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

// Hook return type
interface UseContractWriteReturn {
  /** Current write status */
  status: WriteStatus;
  /** Transaction hash if available */
  hash?: Hash;
  /** Error if occurred */
  error?: Error;
  /** Whether write is in progress */
  isLoading: boolean;
  /** Whether write was successful */
  isSuccess: boolean;
  /** Whether write failed */
  isError: boolean;
  /** Execute the write */
  write: (args?: readonly unknown[]) => Promise<WriteResult>;
  /** Reset the state */
  reset: () => void;
}

export function useContractWrite({
  address,
  abi,
  functionName,
  onSuccess,
  onError,
}: UseContractWriteOptions): UseContractWriteReturn {
  const [status, setStatus] = useState<WriteStatus>('idle');
  const [hash, setHash] = useState<Hash>();
  const [error, setError] = useState<Error>();

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const reset = useCallback(() => {
    setStatus('idle');
    setHash(undefined);
    setError(undefined);
  }, []);

  const write = useCallback(async (args?: readonly unknown[]): Promise<WriteResult> => {
    if (!walletClient || !publicClient) {
      const err = new Error('Wallet not connected');
      setError(err);
      setStatus('error');
      onError?.(err);
      return { error: err };
    }

    try {
      // Prepare transaction
      setStatus('preparing');
      setError(undefined);

      // Get optimal gas settings for Base L2
      const gasPrice = await publicClient.getGasPrice();
      
      // Base L2 uses very low priority fees
      const maxPriorityFeePerGas = 1000000n; // 0.001 gwei

      // Simulate the transaction first
      const { request } = await publicClient.simulateContract({
        address,
        abi,
        functionName,
        args: args as readonly unknown[],
        account: walletClient.account,
      });

      // Request signature
      setStatus('signing');

      const txHash = await walletClient.writeContract({
        ...request,
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas,
      });

      setHash(txHash);
      setStatus('pending');

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === 'success') {
        setStatus('success');
        const result: WriteResult = {
          hash: txHash,
          blockNumber: receipt.blockNumber,
        };
        onSuccess?.(result);
        return result;
      } else {
        const err = new Error('Transaction reverted');
        setError(err);
        setStatus('error');
        onError?.(err);
        return { hash: txHash, error: err };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      setError(error);
      setStatus('error');
      onError?.(error);
      return { error };
    }
  }, [walletClient, publicClient, address, abi, functionName, onSuccess, onError]);

  return {
    status,
    hash,
    error,
    isLoading: status === 'preparing' || status === 'signing' || status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    write,
    reset,
  };
}

/**
 * useContractRead Hook
 * 
 * Simplified hook for reading from contracts on Base L2.
 */

import { useEffect } from 'react';

interface UseContractReadOptions<T> {
  /** Contract address */
  address: Address;
  /** Contract ABI */
  abi: Abi;
  /** Function name to call */
  functionName: string;
  /** Function arguments */
  args?: readonly unknown[];
  /** Whether to watch for changes */
  watch?: boolean;
  /** Watch interval in ms */
  watchInterval?: number;
  /** Enabled flag */
  enabled?: boolean;
}

interface UseContractReadReturn<T> {
  /** Read result */
  data?: T;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Error object */
  error?: Error;
  /** Refetch function */
  refetch: () => Promise<void>;
}

export function useContractRead<T>({
  address,
  abi,
  functionName,
  args,
  watch = false,
  watchInterval = 5000,
  enabled = true,
}: UseContractReadOptions<T>): UseContractReadReturn<T> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const publicClient = usePublicClient();

  const fetch = useCallback(async () => {
    if (!publicClient || !enabled) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await publicClient.readContract({
        address,
        abi,
        functionName,
        args,
      });
      setData(result as T);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Read failed'));
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, address, abi, functionName, args, enabled]);

  // Initial fetch
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Watch for changes
  useEffect(() => {
    if (!watch || !enabled) return;

    const interval = setInterval(fetch, watchInterval);
    return () => clearInterval(interval);
  }, [watch, watchInterval, fetch, enabled]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch: fetch,
  };
}

export default useContractWrite;
