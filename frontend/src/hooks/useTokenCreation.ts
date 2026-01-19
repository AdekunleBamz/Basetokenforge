/**
 * Token Creation Hook
 * 
 * Handles the full token creation flow with the TokenFactory contract.
 */

"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI } from "@/config/contracts";
import { useWalletConnection } from "./useWalletConnection";
import { parseBaseError, type ParsedError } from "@/lib/error-handling";

export interface TokenCreationParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: bigint;
}

export interface TokenCreationResult {
  tokenAddress: `0x${string}`;
  transactionHash: `0x${string}`;
  creator: `0x${string}`;
}

type CreationStep = 
  | 'idle'
  | 'validating'
  | 'preparing'
  | 'awaiting-approval'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'error';

interface UseTokenCreationOptions {
  creationFee?: bigint;
  onSuccess?: (result: TokenCreationResult) => void;
  onError?: (error: ParsedError) => void;
}

const DEFAULT_CREATION_FEE = parseEther('0.0001');

export function useTokenCreation(options: UseTokenCreationOptions = {}) {
  const { 
    creationFee = DEFAULT_CREATION_FEE,
    onSuccess,
    onError,
  } = options;

  const { isConnected, isOnCorrectNetwork, address } = useWalletConnection();

  const [step, setStep] = useState<CreationStep>('idle');
  const [error, setError] = useState<ParsedError | null>(null);
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);

  // Contract write hook
  const { 
    data: hash,
    isPending: isWritePending,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  // Transaction receipt hook
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Create token function
  const createToken = useCallback(async (params: TokenCreationParams) => {
    // Reset state
    setError(null);
    setTokenAddress(null);
    setStep('validating');

    // Validate connection
    if (!isConnected) {
      const err = parseBaseError(new Error('Wallet not connected'));
      setError(err);
      setStep('error');
      onError?.(err);
      return;
    }

    if (!isOnCorrectNetwork) {
      const err = parseBaseError(new Error('Wrong network'));
      setError(err);
      setStep('error');
      onError?.(err);
      return;
    }

    // Validate parameters
    if (!params.name || params.name.length === 0) {
      const err = parseBaseError(new Error('Token name is required'));
      setError(err);
      setStep('error');
      onError?.(err);
      return;
    }

    if (!params.symbol || params.symbol.length === 0) {
      const err = parseBaseError(new Error('Token symbol is required'));
      setError(err);
      setStep('error');
      onError?.(err);
      return;
    }

    if (params.initialSupply <= BigInt(0)) {
      const err = parseBaseError(new Error('Initial supply must be greater than 0'));
      setError(err);
      setStep('error');
      onError?.(err);
      return;
    }

    setStep('preparing');

    try {
      setStep('awaiting-approval');

      writeContract({
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: 'createToken',
        args: [params.name, params.symbol, params.decimals, params.initialSupply],
        value: creationFee,
      }, {
        onError: (err) => {
          const parsed = parseBaseError(err);
          setError(parsed);
          setStep('error');
          onError?.(parsed);
        },
        onSuccess: () => {
          setStep('pending');
        },
      });
    } catch (err) {
      const parsed = parseBaseError(err);
      setError(parsed);
      setStep('error');
      onError?.(parsed);
    }
  }, [isConnected, isOnCorrectNetwork, creationFee, writeContract, onError]);

  // Reset everything
  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setTokenAddress(null);
    resetWrite();
  }, [resetWrite]);

  // Update step based on transaction status
  if (isWritePending && step === 'awaiting-approval') {
    // Already in awaiting-approval
  } else if (hash && step === 'awaiting-approval') {
    setStep('pending');
  }

  if (isConfirming && step === 'pending') {
    setStep('confirming');
  }

  if (isConfirmed && hash && step === 'confirming') {
    setStep('success');
    // In a real app, we'd parse the logs to get the token address
    onSuccess?.({
      tokenAddress: tokenAddress || '0x0000000000000000000000000000000000000000',
      transactionHash: hash,
      creator: address || '0x0000000000000000000000000000000000000000',
    });
  }

  return {
    // State
    step,
    error,
    hash,
    tokenAddress,
    
    // Status flags
    isIdle: step === 'idle',
    isValidating: step === 'validating',
    isPreparing: step === 'preparing',
    isAwaitingApproval: step === 'awaiting-approval',
    isPending: step === 'pending',
    isConfirming: step === 'confirming',
    isSuccess: step === 'success',
    isError: step === 'error',
    isLoading: ['validating', 'preparing', 'awaiting-approval', 'pending', 'confirming'].includes(step),
    
    // Actions
    createToken,
    reset,
    
    // Fee info
    creationFee,
  };
}
