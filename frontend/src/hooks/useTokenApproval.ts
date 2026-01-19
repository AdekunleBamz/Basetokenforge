/**
 * Token Approval Hook for Base Chain
 * 
 * Manages ERC20 token approvals with infinite approval support,
 * allowance checking, and revocation capabilities.
 */

import { useState, useCallback, useEffect } from 'react';
import { useWriteContract, usePublicClient, useAccount } from 'wagmi';
import type { Address } from 'viem';
import { parseUnits, formatUnits, maxUint256 } from 'viem';

// ERC20 Approval ABI
const APPROVAL_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export type ApprovalStatus = 
  | 'idle'
  | 'checking'
  | 'needs-approval'
  | 'awaiting-signature'
  | 'pending'
  | 'approved'
  | 'error';

export interface AllowanceInfo {
  /** Current allowance in wei */
  allowance: bigint;
  /** Current allowance formatted */
  allowanceFormatted: string;
  /** Whether allowance is sufficient for amount */
  isSufficient: boolean;
  /** Whether this is max approval */
  isMaxApproval: boolean;
}

export interface UseTokenApprovalReturn {
  /** Current approval status */
  status: ApprovalStatus;
  /** Current allowance info */
  allowanceInfo: AllowanceInfo | null;
  /** Error if any */
  error: Error | null;
  /** Check current allowance */
  checkAllowance: (tokenAddress: Address, spender: Address, requiredAmount?: bigint) => Promise<AllowanceInfo>;
  /** Approve tokens for spender */
  approve: (tokenAddress: Address, spender: Address, amount?: bigint) => Promise<boolean>;
  /** Revoke approval (set to 0) */
  revoke: (tokenAddress: Address, spender: Address) => Promise<boolean>;
  /** Reset state */
  reset: () => void;
  /** Is transaction pending */
  isPending: boolean;
}

/**
 * Hook for managing ERC20 token approvals on Base
 */
export function useTokenApproval(): UseTokenApprovalReturn {
  const publicClient = usePublicClient();
  const { address: account } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  
  const [status, setStatus] = useState<ApprovalStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [allowanceInfo, setAllowanceInfo] = useState<AllowanceInfo | null>(null);

  /**
   * Check current allowance for a spender
   */
  const checkAllowance = useCallback(
    async (
      tokenAddress: Address,
      spender: Address,
      requiredAmount: bigint = 0n
    ): Promise<AllowanceInfo> => {
      if (!publicClient || !account) {
        throw new Error('Wallet not connected');
      }

      setStatus('checking');

      try {
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: APPROVAL_ABI,
          functionName: 'allowance',
          args: [account, spender],
        });

        const info: AllowanceInfo = {
          allowance,
          allowanceFormatted: formatUnits(allowance, 18),
          isSufficient: allowance >= requiredAmount,
          isMaxApproval: allowance === maxUint256,
        };

        setAllowanceInfo(info);
        setStatus(info.isSufficient ? 'approved' : 'needs-approval');

        return info;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check allowance'));
        setStatus('error');
        throw err;
      }
    },
    [publicClient, account]
  );

  /**
   * Approve tokens for a spender
   * @param amount - Amount to approve (default: max uint256 for infinite approval)
   */
  const approve = useCallback(
    async (
      tokenAddress: Address,
      spender: Address,
      amount: bigint = maxUint256
    ): Promise<boolean> => {
      if (!account) {
        setError(new Error('Wallet not connected'));
        setStatus('error');
        return false;
      }

      try {
        setStatus('awaiting-signature');
        setError(null);

        await writeContractAsync({
          address: tokenAddress,
          abi: APPROVAL_ABI,
          functionName: 'approve',
          args: [spender, amount],
        });

        setStatus('pending');

        // Wait a bit for the transaction to be indexed
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Verify the approval
        const newAllowance = await checkAllowance(tokenAddress, spender, amount);
        
        if (newAllowance.isSufficient) {
          setStatus('approved');
          return true;
        }

        return false;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Approval failed');
        setError(error);
        setStatus('error');
        return false;
      }
    },
    [account, writeContractAsync, checkAllowance]
  );

  /**
   * Revoke approval (set allowance to 0)
   */
  const revoke = useCallback(
    async (tokenAddress: Address, spender: Address): Promise<boolean> => {
      return approve(tokenAddress, spender, 0n);
    },
    [approve]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setAllowanceInfo(null);
  }, []);

  return {
    status,
    allowanceInfo,
    error,
    checkAllowance,
    approve,
    revoke,
    reset,
    isPending: isPending || status === 'pending',
  };
}

/**
 * Format allowance for display
 */
export function formatAllowance(allowance: bigint, decimals: number = 18, symbol: string = ''): string {
  if (allowance === maxUint256) {
    return 'Unlimited';
  }

  const formatted = formatUnits(allowance, decimals);
  const num = parseFloat(formatted);

  if (num === 0) {
    return '0';
  }

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B ${symbol}`.trim();
  }

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M ${symbol}`.trim();
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K ${symbol}`.trim();
  }

  return `${num.toLocaleString()} ${symbol}`.trim();
}

/**
 * Parse approval amount from user input
 */
export function parseApprovalAmount(
  input: string,
  decimals: number = 18,
  useMax: boolean = false
): bigint {
  if (useMax) {
    return maxUint256;
  }

  const cleanedInput = input.replace(/,/g, '');
  return parseUnits(cleanedInput, decimals);
}

export default useTokenApproval;
